# Deploy guide (Cidade Sombra)

This project is configured as a Next.js app and can be deployed either to **Vercel** (easiest) or with **Docker**.

## 0) Pre-deploy checks

1. Ensure your game source exists in one of these folders at repo root:
   - `app/` (App Router), or
   - `pages/` (Pages Router)
2. Ensure required environment variables are configured in your platform:
   - `SESSION_SECRET` (from `.env.example`)
3. Validate production build locally:

```bash
npm ci
npm run build
npm run start
```

---

## Option A: Deploy on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **New Project** and import the repo.
3. Set framework to **Next.js** (auto-detected in most cases).
4. Add environment variable:
   - `SESSION_SECRET`
5. Deploy.

After deployment, every push to the configured branch triggers a new production deploy.

---

## Option B: Deploy with Docker

The repository includes a production `Dockerfile` using Next.js standalone output.

### Build image

```bash
docker build -t cidade-sombra:latest .
```

### Run container

```bash
docker run --rm -p 3000:3000 \
  -e SESSION_SECRET='replace-with-a-strong-secret' \
  cidade-sombra:latest
```

Open `http://localhost:3000`.

### Example (Fly.io / Render / Railway)

Any provider that supports Docker can use the same image. Configure:

- Port: `3000`
- Env vars: `SESSION_SECRET`
- Health check path: `/`

---

## Troubleshooting

- **`Couldn't find any pages or app directory`**
  - Add `app/` or `pages/` folder with your Next.js game source.
- **Session/auth issues in production**
  - Verify `SESSION_SECRET` is present and stable across restarts.
- **Build fails because of missing deps**
  - Run `npm ci` instead of `npm install` in CI/CD for reproducible installs.
