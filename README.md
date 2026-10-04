# Market AI · Mall of America indoor map MVP

A lightweight, responsive, interactive indoor-map prototype for Mall of America in Bloomington, Minnesota. It runs as a static site: no build step, server-side API, or external data source is required.

## MVP features

- Schematic maps for floors 1–4, with North Garden, East Broadway, South Avenue, West Market, Central Parkway, and Nickelodeon Universe shown.
- Search by store name **or unit number**, with quick-search suggestions.
- Floor switching, selectable map markers, store/unit/floor/area details, and locally saved favorites.
- Indoor route planning from four sample entrances, including walking paths and lift/escalator connections between floors.
- Map zoom controls, mouse-wheel zoom, drag-to-pan, keyboard-accessible controls, and responsive mobile layout.
- GitHub Actions workflow for publishing the static site to GitHub Pages.

## Run locally

Open `index.html` directly, or start a static server from the repository root:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` deploys to GitHub Pages after pushes to `main`. It can also be run manually from **Actions → Deploy static site to GitHub Pages → Run workflow**. GitHub Pages must be enabled with **GitHub Actions** as its source; the workflow requests Pages enablement automatically when repository permissions allow it.

Expected project-site URL:

`https://soatmuminovxurshidbek4-droid.github.io/market-ai/`

## Important prototype note

This is an MVP demonstration, not an official Mall of America directory. The floor plans are schematic, and tenant names, unit numbers, and positions are sample data; check with the mall for real-time store locations and accessibility details before using them for an actual visit. Route distances and times are illustrative estimates.
