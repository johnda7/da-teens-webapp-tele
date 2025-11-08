Deploy (GitHub Pages)

- Production host: GitHub Pages on main branch.
- Base path: `/da-teens-webapp-tele/`.

How it works
- Push to `main` triggers `.github/workflows/deploy.yml`.
- Workflow builds with `VITE_BASE=/da-teens-webapp-tele/` and publishes `dist`.

Local production check
- `npm run build:pages`
- `npm run preview` → open http://localhost:8080/

Notes
- For custom domain set `VITE_BASE=/` and configure Pages CNAME.
- Dev server always uses base `/`.
