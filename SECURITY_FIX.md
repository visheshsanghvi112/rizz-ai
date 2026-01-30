# Security Incident Response

## What Happened
An API key was accidentally committed to the repository in commit `4e5eb82`.

## Immediate Actions Required

### 1. Revoke the Exposed Key
- Go to https://aistudio.google.com/app/apikey
- Delete the key: `AIzaSyCxVdqJok57kRA1GwHE-K10xvJrv4Sg_tI`
- Generate a new API key
- Add the new key to your local `.env` file only

### 2. Clean Git History

Run these commands to remove the key from git history:

```bash
# Install git-filter-repo if you don't have it
# (or use BFG Repo-Cleaner as an alternative)

# Option 1: Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --replace-text <(echo 'AIzaSyCxVdqJok57kRA1GwHE-K10xvJrv4Sg_tI==>REDACTED_API_KEY')

# Option 2: Using BFG Repo-Cleaner (easier)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
# Create a file called passwords.txt with the API key
echo "AIzaSyCxVdqJok57kRA1GwHE-K10xvJrv4Sg_tI" > passwords.txt
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
rm passwords.txt

# Force push to GitHub (THIS WILL REWRITE HISTORY)
git push origin --force --all
```

### 3. Alternative: Delete and Recreate Repository (Simpler but drastic)

If the above seems too complex:

```bash
# 1. Delete the repository on GitHub via the website

# 2. Remove git history locally
rm -rf .git

# 3. Reinitialize
git init
git add .
git commit -m "Initial commit (cleaned)"

# 4. Create a new repository on GitHub and push
git remote add origin <new-repo-url>
git push -u origin main
```

## Prevention
- ✅ `.env` is now in `.gitignore`
- ✅ API keys are loaded from environment variables
- ✅ `.env.example` contains no real keys
- 🔔 Set up GitGuardian alerts (already working!)

## After Cleanup
1. Verify the key is gone: `git log -S "AIzaSyCxVdqJok57kRA1GwHE-K10xvJrv4Sg_tI"`
2. Add your new key to `.env` locally
3. Add the new key to Vercel environment variables
4. Never commit `.env` files
