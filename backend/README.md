# CommonGround Backend

Python/Flask backend for email reminders and scheduled notifications.

## Features

- 📧 Email notifications via SendGrid
- ⏰ Automated activity reminders (24 hours before)
- 📅 Daily mood check-in reminders (9 AM)
- 🔌 REST API endpoints for manual triggers
- 🔄 Background scheduler runs automatically

## Setup

### 1. Install Python Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
FLASK_PORT=5001
```

### 3. Get SendGrid API Key

1. Sign up at https://sendgrid.com (free tier = 100 emails/day)
2. Go to Settings → API Keys
3. Create new API key with "Full Access"
4. Copy the key to your `.env` file

### 4. Add Email Column to Users Table

In Supabase, add an `email` column to your `users` table:

```sql
ALTER TABLE users ADD COLUMN email TEXT;
```

## Running the Backend

```bash
cd backend
python3 app.py
```

You should see:
```
🚀 CommonGround Backend Starting...
📡 Server running on http://localhost:5001
💚 Ready to send email reminders!
📅 Scheduler started!
```

## API Endpoints

### Health Check
```bash
GET http://localhost:5001/health
```

### Send Test Email
```bash
POST http://localhost:5001/api/send-test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Manually Trigger Activity Reminders
```bash
POST http://localhost:5001/api/trigger-activity-reminders
```

### Manually Trigger Check-in Reminders
```bash
POST http://localhost:5001/api/trigger-checkin-reminders
```

### Save User Email
```bash
POST http://localhost:5001/api/user-email
Content-Type: application/json

{
  "user_id": "user-uuid-here",
  "email": "user@example.com"
}
```

## Automated Schedule

The backend automatically runs:

- **Activity Reminders**: Every hour, checks for activities happening in 24 hours
- **Daily Check-in Reminders**: Every day at 9:00 AM

## Testing Without SendGrid

If you don't add a SendGrid API key, emails will be logged to console instead of actually sending. This is useful for development!

## Connecting to React Frontend

In your React components, call the backend like this:

```javascript
// Send test email
const response = await fetch('http://localhost:5001/api/send-test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
});

const result = await response.json();
console.log(result);
```

## Project Structure

```
backend/
├── app.py              # Main Flask server & API endpoints
├── email_service.py    # Email sending logic
├── scheduler.py        # Reminder checking logic
├── requirements.txt    # Python dependencies
├── .env               # Your API keys (DO NOT COMMIT)
└── .env.example       # Template for environment variables
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

**Module not found:**
```bash
pip3 install -r requirements.txt
```

**Emails not sending:**
- Check SendGrid API key is correct
- Verify FROM_EMAIL is verified in SendGrid
- Check console logs for errors
