# Google Sign-In Setup Guide

## 🔧 Configuration Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** or **People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: PawMatch
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:4200` (for development)
     - `https://pawmatch.azurewebsites.net` (for production)
   - Authorized redirect URIs:
     - `http://localhost:4200` (for development)
     - `https://pawmatch.azurewebsites.net` (for production)

### 2. Update Your Code

Replace `YOUR_GOOGLE_CLIENT_ID` in `src/app/pages/sign-in/sign-in.ts` (line 56):

```typescript
client_id: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
```

Example:

```typescript
client_id: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
```

### 3. Environment Variables (Optional - Recommended)

Create environment files for better security:

**src/environments/environment.ts** (development):

```typescript
export const environment = {
  production: false,
  googleClientId: 'YOUR_DEV_CLIENT_ID.apps.googleusercontent.com',
};
```

**src/environments/environment.prod.ts** (production):

```typescript
export const environment = {
  production: true,
  googleClientId: 'YOUR_PROD_CLIENT_ID.apps.googleusercontent.com',
};
```

Then update `sign-in.ts`:

```typescript
import { environment } from '../../../environments/environment';

// In signInWithGoogle method:
client_id: environment.googleClientId,
```

## 🎯 How It Works

### 1. User Flow

1. User clicks "Sign in with Google" button
2. Google OAuth popup opens
3. User selects/signs into Google account
4. Google returns access token
5. App fetches user info (email, name, picture)
6. App creates/updates user in AuthService
7. User is redirected to Match page (or Register Dog if no dog registered)

### 2. Code Architecture

**sign-in.ts** - Google OAuth flow:

```typescript
async signInWithGoogle() {
  // 1. Initialize Google Sign-In
  // 2. Request access token
  // 3. Fetch user info from Google
  // 4. Sign in with AuthService
  // 5. Navigate to appropriate page
}
```

**auth.service.ts** - New method:

```typescript
signInWithGoogle(googleData: {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}): Promise<{ success: boolean; error?: string }>
```

**auth.model.ts** - Updated User interface:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string; // New: Google profile picture
  googleId?: string; // New: Google user ID
  createdAt: Date;
}
```

## 🧪 Testing

### Development Testing

1. Start the dev server:

   ```bash
   npm start
   ```

2. Navigate to `http://localhost:4200/sign-in`

3. Click "Sign in with Google"

4. Select a Google account

5. Grant permissions

6. Verify redirect to Match or Register Dog page

### Production Testing

1. Deploy to Azure:

   ```bash
   npm run build:prod
   az staticwebapp deploy --name pawmatch --token YOUR_TOKEN
   ```

2. Navigate to `https://pawmatch.azurewebsites.net/sign-in`

3. Test Google Sign-In flow

## 🔒 Security Best Practices

### 1. Never Commit Client ID to Git

Add to `.gitignore`:

```
src/environments/environment.ts
src/environments/environment.prod.ts
```

Keep example files:

```
src/environments/environment.example.ts
```

### 2. Validate Tokens on Backend

In production, always validate Google tokens on your backend:

```typescript
// Example backend validation (Node.js)
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
```

### 3. Use HTTPS Only in Production

Google OAuth requires HTTPS for production domains.

### 4. Implement CSRF Protection

Add state parameter for CSRF protection:

```typescript
const state = crypto.randomUUID();
sessionStorage.setItem('google_oauth_state', state);

// Then verify state in callback
```

## 🐛 Troubleshooting

### Error: "Google Sign-In not loaded"

**Solution:** Check that the Google Sign-In script is loaded in `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Error: "idpiframe_initialization_failed"

**Causes:**

- Using HTTP instead of HTTPS in production
- Incorrect authorized origins in Google Console
- Browser blocking third-party cookies

**Solutions:**

1. Use HTTPS in production
2. Verify origins match exactly
3. Check browser cookie settings

### Error: "popup_closed_by_user"

**Cause:** User closed the popup before completing sign-in

**Solution:** This is expected behavior, handle gracefully:

```typescript
catch (error: any) {
  if (error === 'popup_closed_by_user') {
    // Don't show error, user intentionally closed
    return;
  }
  this.errorMessage.set(error.message);
}
```

### Error: "access_denied"

**Cause:** User denied permissions

**Solution:** Handle gracefully and provide feedback:

```typescript
this.errorMessage.set('Google Sign-In was cancelled. Please try again.');
```

## 📚 Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Cloud Console](https://console.cloud.google.com/)

## ✅ Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API or People API
- [ ] Created OAuth 2.0 Client ID
- [ ] Configured OAuth consent screen
- [ ] Added authorized origins and redirect URIs
- [ ] Updated `client_id` in code
- [ ] (Optional) Created environment files
- [ ] Tested in development
- [ ] Tested in production
- [ ] Verified security best practices

## 🎉 You're Done!

Your PawMatch app now supports Google Sign-In! Users can sign in with their Google account in one click.

### Current Implementation Status

✅ Google OAuth flow implemented  
✅ User info fetched from Google  
✅ AuthService integration complete  
✅ User model supports Google data  
✅ Error handling implemented  
✅ Loading states handled

### Next Steps (Optional Enhancements)

- Add Google Sign-In button design guidelines
- Implement "Sign in with Apple" for iOS
- Add Facebook Login
- Implement refresh token logic
- Add user profile editing with Google photo
