# PayGate Cold Email Outreach

Send personalized cold emails to Gumroad creators showing them how much they'd save switching to PayGate.

## Setup

1. Install nodemailer (from the PayGate project root):
   ```
   npm install nodemailer
   ```

2. Generate a Gmail App Password:
   - Go to Google Account > Security > 2-Step Verification > App Passwords
   - Create a new app password for "Mail"

3. Edit `scripts/outreach/.env` with your credentials:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   FROM_NAME=Jake
   ```

## Usage

Add leads to `leads.json`:
```json
[
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "product": "UI Kit Pro",
    "revenue": 12000,
    "painPoint": "love the design system you've built"
  }
]
```

Preview emails without sending:
```
node scripts/outreach/send.js --dry-run
```

Send for real:
```
node scripts/outreach/send.js
```

## How it works

- Reads leads from `leads.json`
- Skips anyone already in `sent.json`
- Personalizes subject + body with their product name, revenue, and calculated fee savings
- Sends via Gmail SMTP with 30s delay between emails
- Logs each send to `sent.json` with timestamp
