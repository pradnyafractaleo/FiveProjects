# Nugget Feed

A colorful feed of bite-size "nuggets" from free sources (Wikipedia for now). No keys, no build step.

- `index.html`: main portal. One row of cards per category, plus search. Tap a card for a summary and a link to the source.
- `admin.html`: passcode-protected admin. Add, edit, reorder or delete categories. Default passcode is `fractaleo` (change it from the admin page).
- `config.json`: the published categories. "Publish to all devices" in admin writes this file through the GitHub API using your own fine-grained token.

Host free with GitHub Pages: repo Settings → Pages → deploy from branch, root folder. The site is then at `https://<user>.github.io/fiveprojects/discover/`.

Note: the passcode only keeps casual visitors out of the admin screen; the real protection for publishing is your GitHub token.
