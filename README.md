# Shady GG Website — Polished V4

Upload every file in this folder to the **root** of the GitHub repository.

## Included improvements
- Smaller home and inner-page header sections so visitors immediately see that more content is below.
- Animated smoke layers and brighter drifting ember particles.
- Scroll prompts on every header.
- Shady Squad subscriber and milestone tracking.
- Official YouTube links point to `https://www.youtube.com/@ShadyGG-13`.
- All pages, including `about.html`, are included at the root level.

## Updating the subscriber count
Open `script.js` and change this line:

```js
const CURRENT_SUBSCRIBERS=0;
```

Replace `0` with the current number. The milestone bars update automatically.

## GitHub Pages
Use **Settings → Pages → Deploy from a branch → main → /(root)**.

## Mobile menu fix
This build includes a touch-friendly mobile navigation patch. Upload both `script.js` and `styles.css` together, and replace the HTML files so the menu button has the correct navigation attributes.


## Automatic YouTube statistics

The website reads `channel-stats.json`. A GitHub Actions workflow updates that file every six hours using the repository secret `YOUTUBE_API_KEY`.

After uploading the site:

1. Make sure `.github/workflows/update-youtube-stats.yml` exists in the repository.
2. Open **Actions → Update YouTube statistics → Run workflow**.
3. Wait for the green check, then open `channel-stats.json` to confirm the real channel numbers were saved.
4. GitHub Pages may take a minute or two to display the new values.

Never place the API key in an HTML, JavaScript, JSON, or README file.
