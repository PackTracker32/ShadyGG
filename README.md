# Shady GG — Automatic Video Hub

This package upgrades the website so:

- The homepage automatically displays the newest public YouTube upload.
- The Videos page automatically displays every public upload as a numbered mission.
- Subscriber count, video count, channel views, milestone bars, latest-video title, thumbnail, link, and upload date update from YouTube.
- The existing mobile menu, smoke, embers, and responsive design remain included.

## Upload these files

Upload every file and folder in this package to the repository root, replacing older versions when GitHub asks.

The workflow must remain at:

`.github/workflows/update-youtube-stats.yml`

Keep the existing repository secret named:

`YOUTUBE_API_KEY`

## Run the first update

After committing the files:

1. Open **Actions**.
2. Select **Update YouTube statistics**.
3. Choose **Run workflow**.
4. Wait for the green check.
5. Wait 1–3 minutes for GitHub Pages to redeploy.
6. Hard-refresh the site.

The scheduled workflow runs every six hours. You can also run it manually after publishing a new video.

## Files that power the automation

- `update-youtube-stats.mjs` retrieves channel statistics and the complete uploads playlist.
- `channel-stats.json` stores the public data used by the website.
- `script.js` fills the homepage and mission archive automatically.
- `videos.html` is the automatic mission archive.
