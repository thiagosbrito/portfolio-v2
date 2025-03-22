# Message System Documentation

This document explains how the messaging system works in your portfolio.

## Overview

The messaging system allows visitors to send you messages via the contact form. Currently, messages are stored in the Supabase database and can be managed through the admin panel. Email integration is not currently enabled.

## Features

1. Storage of messages in a Supabase database
2. Admin panel for viewing and managing messages
3. Message threading support for future email integration

## Database Setup

The system uses two tables in your Supabase database:
- `messages` - Stores incoming messages from the contact form
- `message_replies` - Stores your replies to messages

Run the SQL script in `supabase/migrations/20240317_messages_tables.sql` to create these tables.

## Usage

1. **Receiving Messages**:
   - When someone submits the contact form, their message is saved to the database
   - You can view new messages in the admin panel at `/admin/messages`

2. **Managing Messages**:
   - Mark messages as read/unread
   - Delete messages you no longer need
   - View message history and replies

## Future Email Integration

Email integration (with Outlook, Gmail, etc.) can be added in the future if needed. The system is designed to support:
- Email notifications for new messages
- Replying to messages via email
- Tracking email conversations with thread IDs

## Security Considerations

- Messages are protected by Supabase Row Level Security (RLS)
- Only authenticated admin users can view and manage messages
- The contact form has basic validation to prevent spam 