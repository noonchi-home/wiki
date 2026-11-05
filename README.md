# NOONCHI Wiki

Documentation for the NOONCHI smart-home agent and CSE 406 project milestones.

- `site/guide/` contains system operation and the demo walkthrough.
- `site/submissions/` contains the CSE 406 milestone pages.
- `site/public/submission-a/` and `site/public/submission-b/` contain English PDFs and LaTeX sources. The B source was reconstructed from its final PDF.

## Local preview

Use Node.js 22.

```sh
npm ci
npm run dev
```

## GitHub Pages

Use **Settings → Pages → Build and deployment → Source → GitHub Actions**. The workflow builds changes pushed to `main` and sets the base path from the repository name.
