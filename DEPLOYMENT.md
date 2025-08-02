# Deployment Guide

## GitHub Pages Deployment

### Prerequisites
1. Create a new GitHub repository named `silli-meter`
2. Push this code to the repository

### Steps to Deploy

1. **Create the repository on GitHub:**
   ```bash
   # Create a new repository on GitHub.com named "silli-meter"
   ```

2. **Push the code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/silli-meter.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "gh-pages" branch
   - Save

4. **The PWA will be available at:**
   ```
   https://YOUR_USERNAME.github.io/silli-meter/
   ```

### Testing the Deployment

Once deployed, you can test the PWA with these URLs:

- **Helper Mode:** `https://YOUR_USERNAME.github.io/silli-meter/?mode=helper&family=fam_123&session=test_session`
- **Low-Power Mode:** `https://YOUR_USERNAME.github.io/silli-meter/?mode=low_power&family=fam_123&session=test_session`

### Update Bot Configuration

After deployment, update the bot's `.env` file:
```
PWA_HOST=YOUR_USERNAME.github.io
```

Then restart the bot to use the deployed PWA. 