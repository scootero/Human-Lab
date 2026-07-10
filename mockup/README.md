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

## WF1 automation

1. Validate Drive `app.json` and `source.*`
2. Trigger the prepared Vercel mockup project with GitHub `gitSource`
3. Poll until the deployment is ready
4. Write `mockup.previewUrl`, `deployment.mockup.url`, `deployment.mockup.deploymentUrl`, `deployment.mockup.vercelProjectId`, and `deployment.mockup.lastDeployedAt` back to `app.json`

n8n does not run `installCommand`, `buildCommand`, or `deployCommand`; Vercel builds from the GitHub repo with Root Directory = `mockup`.

The landing page **never imports this source**. It embeds the deployed mockup URL in an iframe after deploy.
