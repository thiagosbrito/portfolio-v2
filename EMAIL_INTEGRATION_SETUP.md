# Email Integration Setup for Portfolio Messages

This document provides instructions for setting up the email integration with your Outlook account for your portfolio's messaging system. When configured correctly, this will allow you to:

1. Receive email notifications when someone sends a message through your portfolio's contact form
2. Reply to those messages from your admin panel, which will send emails from your Outlook account
3. Have replies to those emails automatically show up in your admin message conversation history

## Prerequisites

- An Outlook email account (brito.dev@outlook.com)
- An app password or your regular email password for SMTP access
- A service that can forward email replies to your webhook (e.g., Zapier, Make (Integromat), Pipedream, or EmailWebhook)

## Step 1: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```
EMAIL_USER=brito.dev@outlook.com
EMAIL_PASSWORD=your-app-password-or-email-password
EMAIL_WEBHOOK_VERIFY_TOKEN=your-secret-verification-token
```

## Step 2: Set Up Email Forwarding

You'll need a service that can forward incoming emails to your webhook. Here are some options:

### Option 1: Zapier

1. Create a new Zap with the trigger "New Inbound Email in Mailbox"
2. Connect your Outlook account (brito.dev@outlook.com)
3. Set up filters to only process emails that are replies to your portfolio messages
4. Add an action to make a POST request to your webhook endpoint:
   - URL: `https://yourdomain.com/api/email/webhook`
   - Method: POST
   - Body Type: JSON
   - Body: 
     ```json
     {
       "text": "{{body_plain}}",
       "html": "{{body_html}}",
       "subject": "{{subject}}",
       "from": "{{from_email}}",
       "headers": {
         "subject": "{{subject}}",
         "references": "{{references}}",
         "message-id": "{{message_id}}"
       }
     }
     ```

### Option 2: Make (Integromat)

1. Create a new scenario with the "Watch Emails" module for Outlook
2. Configure it to monitor your inbox for new emails
3. Add a filter to only process emails that are replies to your portfolio messages
4. Add an HTTP module to make a POST request to your webhook:
   - URL: `https://yourdomain.com/api/email/webhook`
   - Method: POST
   - Body Type: JSON
   - Map the relevant email fields similar to the Zapier example

### Option 3: Forward All Emails (simplest but least secure)

If you don't want to use a service like Zapier, you can set up an Outlook rule to forward all incoming emails to your webhook. However, this is less secure and less reliable.

1. Create a new rule in Outlook to forward all incoming emails to your webhook endpoint
2. You'll need an email-to-webhook service for this

## Step 3: Test the Integration

1. Send a test message through your portfolio's contact form
2. Check your Outlook inbox for the notification email
3. Reply to that email from your admin panel
4. Check your Outlook sent items to confirm the email was sent
5. Reply to that email from your regular email client
6. Verify that the reply appears in your admin panel conversation history

## Troubleshooting

### Emails Not Sending

1. Check your environment variables are correctly set
2. Ensure your Outlook account allows less secure apps or that you're using an app password
3. Check the server logs for SMTP error messages

### Replies Not Being Processed

1. Verify your email forwarding service is correctly set up and running
2. Check that the thread ID is being properly included in the email subject (`[thread_xyz123]`)
3. Look at the server logs when a reply is sent to see if the webhook is receiving the data
4. Test with a simple email to ensure your webhook is functioning

### Security Considerations

The webhook endpoint is publicly accessible. Consider adding additional security:

1. IP restrictions if your email forwarding service has a fixed IP
2. HMAC signature verification for webhook requests
3. Rate limiting to prevent abuse

## Need Help?

If you're having trouble setting up the email integration, check the console logs for detailed error messages or contact your developer for assistance. 