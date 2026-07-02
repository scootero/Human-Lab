# Screenshots

Place PNG screenshots here. Paths must match `app.json` → `media.screenshots`.

## Expected files

| File | Mockup screen to capture | Declared in app.json |
|------|--------------------------|----------------------|
| `01-home.png` | Welcome screen ("Stop guessing. Start testing.") | Yes |
| `02-feature.png` | Active dashboard or experiment detail | Yes |
| `03-results.png` | Results screen after experiment completion | Yes |

## How to capture

1. Run the mockup locally: from package root, `npm run dev`
2. Navigate to the target screen in the interactive prototype
3. Capture at mobile width (~375px) or export from your design tool
4. Save with the exact filenames above

## Landing page behavior

- **Development:** The landing template may render placeholder cards pointing to these paths when files are missing.
- **Production:** Placeholder cards can be omitted automatically once real PNGs exist on Drive or in the deployed bundle.

Do not rename files without updating `app.json`.
