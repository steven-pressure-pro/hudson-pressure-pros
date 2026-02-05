# Custom Domain Setup Guide

Follow these steps to use your custom domain (hudsonpressurepros.com) with GitHub Pages.

## Step 1: Configure DNS Settings

Log in to your domain registrar (where you bought hudsonpressurepros.com) and add these DNS records:

### Option A: Using Apex Domain (hudsonpressurepros.com)

Add these **A Records**:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

### Option B: Using WWW Subdomain (www.hudsonpressurepros.com)

Add this **CNAME Record**:
```
Type: CNAME
Name: www
Value: steven-pressure-pro.github.io
```

### Recommended: Use Both

Set up both options above, then add this CNAME for the apex domain:
```
Type: CNAME
Name: @
Value: steven-pressure-pro.github.io
```

## Step 2: Add CNAME File to Repository

Create a file named `CNAME` (no extension) in the root of your repository with your domain:

```
hudsonpressurepros.com
```

Or if using www:
```
www.hudsonpressurepros.com
```

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Custom domain", enter: `hudsonpressurepros.com`
4. Click **Save**
5. Wait for DNS check to complete (can take up to 24 hours)
6. Once verified, check **"Enforce HTTPS"**

## Step 4: Verify

After DNS propagates (usually 15 minutes to 24 hours):
- Visit https://hudsonpressurepros.com
- Your site should load with a secure HTTPS connection

## Troubleshooting

**DNS not propagating?**
- Wait up to 24 hours
- Check DNS with: https://dnschecker.org

**Certificate errors?**
- Make sure "Enforce HTTPS" is enabled
- Wait a few minutes for certificate to provision

**404 errors?**
- Verify CNAME file is in repository root
- Check that custom domain is saved in GitHub Pages settings

## Quick Command to Add CNAME

Run this in your repository:
```bash
echo hudsonpressurepros.com > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

---

Need help? Contact GitHub Support or check: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
