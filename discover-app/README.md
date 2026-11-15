# NuggetBox

A colorful feed of bite-size "nuggets" from Wikipedia, with hand-drawn card art. No API keys needed. Installable as an app (PWA) on iPhone, Android, Windows and Mac.

Live site: https://pradnyafractaleo.github.io/FiveProjects/discover/

## How it's built

- **React + Vite** source lives here in `discover-app/`. `npm install` then `npm run build` builds the site into `../discover/`, which GitHub Pages serves from the `main` branch. Commit the built files.
- `src/Feed.jsx`: the main feed. One row of cards per category, search, popup with summary and link, pull to refresh.
- `src/Admin.jsx`: passcode-protected admin (default passcode `fractaleo`, change it from the admin page). Add, edit, reorder or delete categories, pick a card art style, and publish settings to all devices.
- `src/About.jsx`: credits, privacy and removal requests.
- `src/sources.js`: fetches articles from the Wikipedia API and trims summaries.
- `src/art.js`: draws the card art in code with [Rough.js](https://roughjs.com) and [blobs](https://blobs.dev) (both MIT). A random color collection is picked each time the app opens.
- `public/`: PWA manifest, icons, service worker and `config.json`.

## Settings

`../discover/config.json` holds the published categories. "Publish to all devices" in Admin writes that file through the GitHub API with your own fine-grained token. The build copies it into `public/` first, so a rebuild keeps your settings.

The passcode only keeps casual visitors out of the admin screen; the real protection for publishing is your GitHub token.

## Licenses

Wikipedia text is CC BY-SA 4.0 and credited in each popup. Nunito font: SIL Open Font License.
