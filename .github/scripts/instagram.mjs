// Pulls the latest posts straight from the Instagram API and saves them into the site.
//
//   node .github/scripts/instagram.mjs           fetch posts → instagram/feed.json + instagram/*.jpg
//   node .github/scripts/instagram.mjs refresh   print a renewed access token (pipe it into `gh secret set`)
//
// Needs IG_ACCESS_TOKEN: a long-lived token from the Meta developer app (Instagram API with Instagram Login).

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://graph.instagram.com';
const OUT_DIR = path.resolve(import.meta.dirname, '../../instagram');
const POST_COUNT = 5; // newest first, straight from the API

const token = process.env.IG_ACCESS_TOKEN;
if (!token) {
  console.error('IG_ACCESS_TOKEN is not set. See README.md → "The Instagram feed".');
  process.exit(1);
}

async function api(endpoint, params) {
  const url = new URL(API + endpoint);
  for (const [k, v] of Object.entries({ ...params, access_token: token })) url.searchParams.set(k, v);
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    // Never echo the URL: it contains the token.
    throw new Error(`Instagram API ${endpoint} failed (${res.status}): ${body.error?.message ?? 'unknown error'}`);
  }
  return body;
}

async function refresh() {
  // Long-lived tokens last 60 days; refreshing (allowed once the token is 24h old) resets the clock.
  const { access_token, expires_in } = await api('/refresh_access_token', { grant_type: 'ig_refresh_token' });
  console.error(`Token refreshed, valid for ${Math.round(expires_in / 86400)} more days.`);
  process.stdout.write(access_token);
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed (${res.status})`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

async function fetchPosts() {
  const { data } = await api('/me/media', {
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
    limit: String(POST_COUNT)
  });

  await mkdir(OUT_DIR, { recursive: true });
  const posts = [];
  for (const item of data) {
    // Instagram's image URLs expire after a few days, so keep a copy alongside the site.
    const remote = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    if (!remote) continue;
    const name = `${item.id}.jpg`;
    try {
      await download(remote, path.join(OUT_DIR, name));
    } catch (err) {
      console.warn(`Skipping post ${item.id}: ${err.message}`);
      continue;
    }
    posts.push({
      id: item.id,
      image: `instagram/${name}`,
      caption: item.caption ?? '',
      type: item.media_type,
      permalink: item.permalink,
      timestamp: item.timestamp
    });
  }
  if (!posts.length) throw new Error('No posts could be saved; keeping the existing feed.');

  // Drop images for posts that have fallen out of the feed.
  const keep = new Set(posts.map(p => `${p.id}.jpg`));
  for (const file of await readdir(OUT_DIR)) {
    if (file.endsWith('.jpg') && !keep.has(file)) await rm(path.join(OUT_DIR, file));
  }

  await writeFile(path.join(OUT_DIR, 'feed.json'), JSON.stringify({ posts }, null, 2) + '\n');
  console.log(`Saved ${posts.length} posts.`);
}

try {
  await (process.argv[2] === 'refresh' ? refresh() : fetchPosts());
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
