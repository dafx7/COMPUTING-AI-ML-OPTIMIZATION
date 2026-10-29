# Deploying a static site to Netlify (free tier)

Applies to `week0/site` now and to the Week 1 site later. Nothing here has been run against Netlify: from the build environment I could reach the public Netlify pages (HTTP 200) but I did not sign in or deploy, and I never ask for or store tokens. Menu names on Netlify change, so treat the steps as a guide and check the current screens. Check the current free-plan limits at netlify.com/pricing before relying on them; I did not verify them.

## What gets deployed

| Item | Path | Purpose |
|---|---|---|
| Site folder | `week0/site` | Contains `index.html` at its root, plus `css/`, `js/`, `favicon.svg` and `_headers` |
| Build config | `week0/netlify.toml` | `publish = "site"`, no build command |
| Security headers | `week0/site/_headers` | CSP and related headers, applied in both deploy methods |

The site has no backend, no accounts, no cookies and no third-party requests. All scripts and styles are separate files so the strict Content-Security-Policy in `_headers` works.

## Method 1: drag and drop (fastest, no GitHub link)

1. Sign in or create a free account at netlify.com.
2. Open the manual deploy page (Netlify Drop, `app.netlify.com/drop`, or in the dashboard: Add new project, then Deploy manually).
3. Drag the **`week0/site` folder itself** onto the page (not the repo, and not `week0`). `index.html` must be at the top level of what you drop.
4. Wait for the deploy to finish. Netlify gives you a random `https://<name>.netlify.app` address.
5. Optional: rename the site under Site configuration, then Site details, then Change site name.
6. To update, drop the folder again on the site's Deploys page.

## Method 2: GitHub to Netlify (redeploys on every push)

1. Make sure the files are on `main`: merge the working branch first.
2. In Netlify: Add new project, Import an existing project, GitHub. Authorize Netlify for the repository `dafx7/COMPUTING-AI-ML-OPTIMIZATION` only if you are comfortable with that access.
3. Branch to deploy: `main`.
4. Build settings:
   - Base directory: `week0`
   - Build command: leave empty
   - Publish directory: `site` (matches `netlify.toml`)
5. Deploy. Every later push to `main` redeploys. For Week 1, create a second Netlify site with Base directory `week1` (or the folder name I use then).

## After deploying: check

```bash
curl -sI https://YOUR-SITE.netlify.app/ | grep -i -E "content-security-policy|x-content-type|referrer"
```

You should see the three headers. Then open the site on a phone over cellular and over campus Wi-Fi, click through the handout, the slides, and press Start in the demo.

## Things that go wrong

| Symptom | Likely cause |
|---|---|
| 404 on the home page after drag and drop | You dropped `week0`, not `week0/site` |
| Plain page without styling | You dropped the folder's contents in a way that lost `css/`, or the base and publish directories are wrong in method 2 |
| Colab links in the handout 404 | The notebooks are not on `main` yet |
| Demo shows no animation | JavaScript is blocked in the browser |

## Security

Never paste a Netlify or GitHub token into any file in the repo. Do not use a personal access token in the Netlify settings of a shared screen. The site collects nothing, so there is no secret to configure.
