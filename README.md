# shellyweasel.com

This folder is the whole website: a one-page artist home page with a hero painting, a short bio, a live Instagram feed and a contact footer.

---

## How it all fits together

There are three parts, and each one has a single job:

```
 Your Mac                    GitHub                         GoDaddy
 ─────────                   ──────                         ───────
 This folder       ──push──▶  Stores the files and   ◀──────  Owns the name
 (where you edit)            serves them as a website       "shellyweasel.com" and
                             (GitHub Pages, free)           points it at GitHub
```

1. **Your Mac.** You edit the files here, in `Desktop/Shelly`.
2. **GitHub.** It keeps a copy of the files and puts them online for free. This is called GitHub Pages.
   - Account: **weaselshelly**
   - Files: https://github.com/weaselshelly/shellyweasel.com
3. **GoDaddy.** It only owns the domain name. Its DNS settings tell browsers that "shellyweasel.com" lives at GitHub. GoDaddy does **not** host the site.

When someone visits shellyweasel.com, GoDaddy sends them to GitHub, and GitHub shows them `index.html`.

---

## What's in this folder

| File | What it is | Safe to edit? |
|---|---|---|
| `index.html` | The page itself: all the text, layout and colors | Yes |
| `images/` | `hero.jpg` (the big painting at the top) and `work-1.jpg` to `work-4.jpg` (shown in the Instagram section until the first feed update) | Yes, swap them anytime |
| `README.md` | This guide | Yes |
| `instagram/` | Your latest Instagram posts, saved automatically. Don't edit them by hand. | No, it updates itself |
| `.github/` | The job that updates the Instagram feed | Only if you know what you're changing |
| `CNAME` | One line that tells GitHub the site's name is shellyweasel.com | **No, leave it alone** |
| `.gitignore` | Tells git to skip Mac clutter files (`.DS_Store`) | No need to touch |

> ⚠️ Don't delete or rename `CNAME`. Without it, shellyweasel.com stops working.

---

## Making changes

### Change the text
1. Open `index.html` in a text editor such as TextEdit, VS Code or BBEdit.
2. Find the words you want to change, such as the bio that starts `I'm Shelly Weasel` or the line `Paintings in watercolor, gouache and oil`.
3. Change only the words between the `>` and `<` marks, then save.

### Change the hero painting
Replace `images/hero.jpg` with another square JPG with the same name. Update its `alt="..."` description in `index.html`.

### Swap an artwork image
1. Pick a JPG image. Square images look best, because the page crops each one to a square.
2. Name it `work-1.jpg`, `work-2.jpg`, `work-3.jpg` or `work-4.jpg`, matching the spot you want to replace.
3. Drop it into the `images/` folder and replace the old file when asked.
4. Optional: in `index.html`, update the description next to it (`alt="..."`). It's what screen readers say aloud.

### The Instagram feed
The "From the studio" section shows your latest Instagram posts, straight from Instagram with no third-party service in between.

How it works: every 6 hours, a GitHub job (`.github/workflows/instagram.yml`) asks Instagram for your newest posts and saves them into the `instagram/` folder (`feed.json` plus the images). Then it republishes the site. If there's nothing new, it does nothing. Until the first run, the section shows the images in `images/` instead.

It needs two secrets, stored in GitHub at **Settings → Secrets and variables → Actions**:

| Secret | What it is |
|---|---|
| `IG_ACCESS_TOKEN` | Your Instagram access token, from your app at developers.facebook.com. It lets the job read your posts. |
| `GH_PAT` | A GitHub token that lets the job renew `IG_ACCESS_TOKEN` every Monday. Instagram tokens expire after 60 days without renewal. |

- **Update it right now:** go to https://github.com/weaselshelly/shellyweasel.com/actions, pick **Update Instagram feed** and click **Run workflow**.
- **If the feed stops updating:** check that page for a red ❌. The usual cause is an expired token. Generate a new one in your Meta app, then in Terminal run `gh secret set IG_ACCESS_TOKEN --repo weaselshelly/shellyweasel.com` and paste it.
- Your Instagram account must stay a **Creator** or **Business** account. Personal accounts can't use the Instagram API.

### How people contact you
The "just hello" link and the "Message me" link in the footer open a direct message to **@shelly_weasel** on Instagram (`https://ig.me/m/shelly_weasel`). On phones it opens the Instagram app. On computers it opens Instagram on the web, where the visitor has to be logged in. No email address appears anywhere on the site.

Messages from people you don't follow may land in your **Message requests** folder, so check there too.

### Preview before publishing
Double-click `index.html` and it opens in your browser. Refresh the browser after each change.
Nothing goes online until you publish.

---

## Publishing your changes

### The easy way
Ask Claude Code: **"publish my site changes."**

### Doing it yourself
Open the Terminal app and run these three commands, one at a time:

```bash
cd ~/Desktop/Shelly
git add -A
git commit -m "Describe what you changed"
git push
```

- `git add -A` gathers up every change.
- `git commit` saves a snapshot with a short note.
- `git push` uploads it to GitHub.

The live site updates about **1–2 minutes** after you push. If you don't see the change, refresh with **Cmd + Shift + R**.

To check whether the site has finished updating, go to
https://github.com/weaselshelly/shellyweasel.com/actions
A green check ✅ means it's live.

---

## Domain settings (GoDaddy)

These are already set up, so you only need this section if something breaks.
Find them at **GoDaddy → My Products → shellyweasel.com → DNS**.

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | weaselshelly.github.io |

Leave all the other records alone (email, pay, ftp, NS, SOA, MX).

> ⚠️ **Don't press "Publish" in GoDaddy's Website Builder.** The old builder site is still in your GoDaddy account. Publishing it can point your domain back at the old site and replace the A records above.

---

## The padlock (HTTPS)

GitHub gives the site a free security certificate, which is what shows the padlock 🔒 in the browser. It can take up to a day to appear after the domain is first connected. Once it's ready:

1. Go to https://github.com/weaselshelly/shellyweasel.com/settings/pages
2. Tick **Enforce HTTPS**.

---

## If something goes wrong

| Problem | Try this |
|---|---|
| My change isn't showing | Wait 2 minutes, then refresh with Cmd + Shift + R. Check the Actions page for a green ✅. |
| `git push` asks me to log in | In Terminal, run `gh auth login --web` and follow the steps. |
| The site shows the old GoDaddy page | Check the DNS records above. Someone may have published the GoDaddy builder site. |
| The site shows a GitHub "404" page | Make sure `index.html` and `CNAME` are still in the folder and were pushed. |
| An image is a gray box | Check that the file name matches exactly, such as `work-1.jpg` (lowercase, `.jpg` not `.jpeg` or `.png`). |
| I broke the page and want the last version back | Run `git checkout -- index.html` in Terminal. This undoes changes since your last commit. |

---

## Accounts at a glance

- **GitHub:** username `weaselshelly`. It hosts the site.
- **Meta for Developers:** your app there gives the site permission to read your Instagram posts (free).
- **GoDaddy:** owns the domain shellyweasel.com and manages its DNS. You renew the domain here every year.
- **Cost:** GitHub Pages is free. You pay only for the GoDaddy domain renewal.
