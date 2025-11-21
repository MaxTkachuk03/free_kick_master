# Infrastructure and Deployment

## Infrastructure as Code

- **Tool:** N/A - Static hosting, no infrastructure code needed
- **Location:** N/A
- **Approach:** Static file deployment

## Deployment Strategy

- **Strategy:** Static file deployment to CDN
- **CI/CD Platform:** GitHub Actions (if using GitHub Pages) or provider-native CI/CD
- **Pipeline Configuration:** `.github/workflows/deploy.yml` (if using GitHub Actions)

## Environments

- **Development:** Local Vite dev server (`npm run dev`)
- **Production:** Static hosting (GitHub Pages, Vercel, or Netlify)

## Environment Promotion Flow

```
Local Development → Build → Deploy to Production
```

## Rollback Strategy

- **Primary Method:** Git revert + redeploy
- **Trigger Conditions:** Critical bugs, broken gameplay
- **Recovery Time Objective:** < 5 minutes (static hosting redeploy is fast)
