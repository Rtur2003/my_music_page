# Admin Panel Setup Guide

## Setting Up Admin Authentication

The admin panel uses environment variables for secure authentication. Follow these steps:

### 1. Development Setup (Local Testing)

For local development, the admin panel uses a default key:
```
ADMIN_KEY = "HASAN_ARTHUR_ADMIN_2024"
```

### 2. Production Setup (Netlify)

1. **Go to your Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Navigate to your site

2. **Set Environment Variable**
   - Go to Site Settings > Environment Variables
   - Click "Add a variable"
   - Set:
     - **Key:** `ADMIN_KEY`
     - **Value:** Your secure admin password (choose something strong!)

3. **Deploy and Test**
   - Redeploy your site for changes to take effect
   - Access `/admin` or `/admin.html` on your live site
   - Enter your ADMIN_KEY to access the panel

### 3. Admin Panel Features

Once authenticated, you can:
- ✅ Add new music tracks
- ✅ Edit existing tracks  
- ✅ Delete tracks
- ✅ Update platform links (Spotify, YouTube, Apple Music, SoundCloud)
- ✅ Manage artwork URLs
- ✅ Real-time updates to main site
- ✅ View analytics and stats

### 4. Security Features

- 🔒 Environment variable authentication
- 🔒 Serverless function validation
- 🔒 Session-based authentication
- 🔒 Auto-logout on close
- 🔒 Rate limiting protection
- 🔒 HTTPS-only access in production

### 5. Accessing the Admin Panel

- **Development:** `http://localhost:3000/admin`
- **Production:** `https://yourdomain.com/admin`

### 6. Troubleshooting

**Can't access admin panel?**
- Check if ADMIN_KEY environment variable is set in Netlify
- Make sure your site has been redeployed after setting the variable
- Clear browser cache and cookies
- Check browser console for error messages

**Changes not appearing?**
- Admin changes are real-time and stored in localStorage
- Main site checks for updates every 5 seconds
- Refresh the main page if needed

**Forgot your admin key?**
- Update the ADMIN_KEY in Netlify environment variables
- Redeploy your site
- Use the new key to log in

### 7. Best Practices

1. **Choose a Strong Admin Key**
   - Use at least 16 characters
   - Include letters, numbers, and symbols
   - Don't share the key publicly

2. **Regular Updates**
   - Change your admin key periodically
   - Keep track of who has access

3. **Monitor Access**
   - Check Netlify function logs for authentication attempts
   - Monitor for unusual activity

### 8. Support

For issues with the admin panel:
1. Check this setup guide first
2. Verify environment variables are set correctly
3. Test in incognito/private browsing mode
4. Check browser developer console for errors

---

**Example Strong Admin Keys:**
- `MusicPortfolio2024_SecureKey!`
- `HassanArthur_Admin_2024#Music`
- `$ecure_Music_Panel_2024!`

**Note:** Never commit your actual admin key to version control!