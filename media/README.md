# Media assets

This folder holds image and video files referenced by `app.json` → `media`.

## Expected files

| File | Purpose | Recommended size |
|------|---------|------------------|
| `icon.png` | App icon | 1024×1024 px |
| `logo.png` | Wordmark / logo | SVG or PNG, transparent background |
| `og-image.png` | Social share / Open Graph image | 1200×630 px |
| `screenshots/01-home.png` | Welcome / home screen | Device-native resolution |
| `screenshots/02-feature.png` | Active experiment or key feature | Device-native resolution |
| `screenshots/03-results.png` | Results or outcomes screen | Device-native resolution |
| `demo.mp4` | Optional product demo video | ≤ 60 seconds |

## Screenshot captions

Declare optional `title` and `description` on each entry in `media.screenshots` in `app.json`. The landing page `screenshots` section (`source: "media"`) uses those captions when rendering the gallery.

See [screenshots/README.md](screenshots/README.md) for capture guidance.

## Placeholder phase

Image binaries are not required while `status` is `draft`. Paths in `app.json` document the expected layout. During development, the landing template may show friendly placeholder cards (e.g. "Add screenshot: media/screenshots/01-home.png") until files exist.

## Naming conventions

- Use lowercase kebab-case filenames
- Prefix screenshots with two-digit order: `01-`, `02-`, etc.
- Match paths exactly as declared in `app.json`
