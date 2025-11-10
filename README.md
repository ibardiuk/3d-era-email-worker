# 3D Era Email Worker

A Cloudflare Worker for handling 3D printing quote request emails with file attachments using Resend.

## Features

- ✅ Handles multipart form data from React frontend
- ✅ Validates all required form fields
- ✅ Supports file attachments (3D models, photos, drawings)
- ✅ Sends formatted HTML emails via Resend
- ✅ CORS support for React frontend
- ✅ Environment variables for sensitive data
- ✅ Email validation
- ✅ Error handling and logging

## Form Fields Supported

- **firstName*** - Customer's first name
- **lastName*** - Customer's last name  
- **phone*** - Customer's phone number
- **email*** - Customer's email address
- **materialType*** - Selected material type
- **printingAccuracy*** - Selected printing accuracy
- **materialColor*** - Selected material color
- **infill** - Infill percentage/density (optional)
- **comment** - Additional comments (optional, 1000 char limit)
- **attachment** - File upload (optional)

*Required fields

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables in Cloudflare Dashboard

After deploying your worker, go to the Cloudflare Dashboard:

1. Navigate to **Workers & Pages** → **Your Worker** → **Settings** → **Variables**
2. Add these environment variables:

**Encrypted Variables (secrets):**
- `RESEND_API_KEY` = your_resend_api_key

**Plain Text Variables:**
- `FROM_EMAIL` = noreply@yourdomain.com (must be verified in Resend)
- `TO_EMAIL` = quotes@yourdomain.com (where you want to receive emails)

### 3. Alternative: Set Variables via Wrangler CLI

```bash
# Set encrypted variable (recommended for API key)
wrangler secret put RESEND_API_KEY

# Set plain text variables
wrangler secret put FROM_EMAIL
wrangler secret put TO_EMAIL
```

### 4. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Add and verify your sending domain

### 5. Deploy to Cloudflare

```bash
# Deploy to production
npm run deploy

# Or develop locally
npm run dev
```

## Usage from React Frontend

```javascript
const handleSubmit = async (formData) => {
  const form = new FormData();
  
  // Add all form fields
  form.append('firstName', firstName);
  form.append('lastName', lastName);
  form.append('phone', phone);
  form.append('email', email);
  form.append('materialType', materialType);
  form.append('printingAccuracy', printingAccuracy);
  form.append('materialColor', materialColor);
  form.append('infill', infill);
  form.append('comment', comment);
  
  // Add file if selected
  if (selectedFile) {
    form.append('attachment', selectedFile);
  }

  try {
    const response = await fetch('https://your-worker.your-subdomain.workers.dev', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result);
      // Show success message
    } else {
      console.error('Error:', result.error);
      // Show error message
    }
  } catch (error) {
    console.error('Network error:', error);
    // Handle network error
  }
};
```

## Environment Variables

Set these in your Cloudflare Worker:

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key (secret) | `re_123abc...` |
| `FROM_EMAIL` | Verified sender email | `noreply@yourdomain.com` |
| `TO_EMAIL` | Recipient email for quotes | `quotes@yourdomain.com` |

## File Attachment Limits

- Maximum file size: 10MB (Cloudflare Worker limit)
- Supported formats: Any file type
- Files are base64 encoded and attached to emails

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Email sent successfully",
  "id": "resend_email_id"
}
```

### Error Response
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Development

```bash
# Start local development server
npm run dev

# Deploy to production
npm run deploy

# View logs
npm run tail
```

## Troubleshooting

1. **CORS errors**: Make sure your React app is making requests to the correct worker URL
2. **API key errors**: Verify your Resend API key is set correctly as a secret
3. **Email not sending**: Check that your FROM_EMAIL is verified in Resend
4. **File upload issues**: Ensure files are under 10MB limit

## Security Notes

- API keys are stored as encrypted environment variables
- CORS is configured to allow all origins (adjust for production)
- Email validation prevents malformed addresses
- All user inputs are sanitized in email templates