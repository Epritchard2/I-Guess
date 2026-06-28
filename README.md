# I Guess — Guild Website

Three-page static site for the **I Guess** WoW guild. No build step, no framework —
just HTML/CSS/JS. Drop it on GitHub Pages (or any host) and it works.

Pages:
- `index.html` — landing / about / raid status / schedule
- `roster.html` — your members, grouped by role, with Logs + Raider.IO links
- `apply.html` — application form that emails you, then hands the applicant a Discord invite

---

## Before it's live — 3 things to set up

### 1. Make applications email you (Formspree)
1. Go to https://formspree.io and make a free account.
2. Create a new form. It gives you a URL like `https://formspree.io/f/abcdwxyz`.
3. Open `apply.html`, find this line near the top of the form:
   ```html
   <form id="application-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```
   Replace `YOUR_FORM_ID` with your real ID (e.g. `abcdwxyz`).

Until you do this, the form still works visually and shows the Discord step —
it just won't email anything.

### 2. Set your Discord invite
In `apply.html`, find the success box near the bottom and replace `YOUR_DISCORD_INVITE`:
```html
<a class="discord-btn" href="https://discord.gg/YOUR_DISCORD_INVITE" ...>
```
Use an invite that drops people into your **applicants** channel.

### 3. Fill in your real links
In all three pages' footers, the Discord / Warcraft Logs / Raider.IO links are `href="#"`.
Swap them for your guild's real URLs.

---

## Editing the roster

Open `roster.html`. There's a big comment block explaining it, but in short:

- Members are split into **Tanks / Healers / DPS** groups.
- To add someone, copy one `.member-card` block, paste it into the right group, and change:
  - the name, the class (and its `c-CLASS` color, e.g. `c-shaman`), the spec
  - the two link `href`s (Warcraft Logs and Raider.IO)
- To open a slot, use the dashed `.member-card empty` block.
- Update the `role-count` number (e.g. `2 / 4`) to match.

Class color options: `c-deathknight c-demonhunter c-druid c-evoker c-hunter c-mage
c-monk c-paladin c-priest c-rogue c-shaman c-warlock c-warrior`.

The 8 members in there now are placeholders (Kuwubara, Kuwubora, etc.) — swap in your
real raiders. Each currently points Logs/Raider.IO at the site homepages; replace with
each person's character URL.

## Editing raid status & schedule
On `index.html`, look for the `EDIT:` comments — the status numbers (8/8, 6/8, etc.)
and the raid nights/times are plain text you can change directly.

---

## Hosting on GitHub Pages
1. Put these files in a repo (e.g. `iguess`).
2. Repo Settings → Pages → deploy from `main` branch, root folder.
3. Done. (If you want a custom domain, add a `CNAME` file with the domain in it.)
