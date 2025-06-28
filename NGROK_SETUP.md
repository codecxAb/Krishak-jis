# Environment Variables Configuration

## Ngrok URL Configuration

To update the ngrok URL when it changes, simply update the following variable in your `.env` file:

```
NEXT_PUBLIC_RECOMMENDATIONS_API_URL=https://your-new-ngrok-url.ngrok-free.app
```

### Steps to update:
1. Start your ngrok tunnel: `ngrok http 5000` (or whatever port your backend runs on)
2. Copy the new ngrok URL (e.g., `https://abc123-45-64-237-226.ngrok-free.app`)
3. Update the `NEXT_PUBLIC_RECOMMENDATIONS_API_URL` value in the `.env` file
4. Restart the development server: `npm run dev`

### Why use environment variables?
- **Easy maintenance**: Change the URL in one place instead of searching through code
- **Environment flexibility**: Different URLs for development, staging, and production
- **Security**: Keep sensitive URLs out of version control if needed
- **Team collaboration**: Each developer can use their own ngrok URL

### Current Environment Variables:
- `NEXT_PUBLIC_RECOMMENDATIONS_API_URL`: Ngrok URL for recommendations API
- `GEMINI_API_KEY`: Google Gemini AI API key (server-side only)
- `NEXT_PUBLIC_API_URL`: Main backend API URL
- Firebase configuration variables

Note: Variables with `NEXT_PUBLIC_` prefix are accessible in the browser, while others are server-side only.
