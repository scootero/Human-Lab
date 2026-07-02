# Mockup source

Interactive prototype referenced by `app.json` → `mockup`.

## Expected layout

```txt
mockup/
├── package.json
├── index.html
├── vite.config.js
├── public/
└── src/
    ├── App.jsx
    └── ...
```

## Local development

From the **package root** (recommended):

```bash
npm install
npm run dev
```

Or from this folder:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Configuration in app.json

| Field | Value |
|-------|-------|
| `type` | `interactive` |
| `sourcePath` | `mockup/` |
| `framework` | `react-vite` |
| `entryPoint` | `mockup/src/App.jsx` |
| `installCommand` | `npm install` |
| `buildCommand` | `npm run build` |
| `devCommand` | `npm run dev` |
| `deployCommand` | `npx vercel deploy --prod` |
| `previewUrl` | `null` until automation deploys |

## Future automation (n8n)

1. Validate the App Package
2. Run `installCommand` and `buildCommand` in `mockup/`
3. Deploy static output (e.g. Vercel)
4. Write `mockup.previewUrl`, `deployment.mockup.url`, `deployment.mockup.vercelProjectId`, and `deployment.mockup.lastDeployedAt` back to `app.json`

The landing page **never imports this source**. It embeds the deployed mockup URL in an iframe after deploy.
