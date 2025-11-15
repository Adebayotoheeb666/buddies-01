# Buddies Chat Feature - Setup Guide

## Overview

This guide walks you through setting up the complete chat feature implementation for Buddies. The implementation includes:

- ✅ Private (1-on-1) messaging
- ✅ Group chat functionality
- ✅ Real-time messaging with Supabase Realtime
- ✅ Message reactions with emojis
- ✅ Message editing and deletion
- ✅ Media/image sharing in chats
- ✅ Read receipts and typing indicators
- ✅ User online/offline status
- ✅ Chat notifications in header
- ✅ Group admin capabilities

## Step 1: Create Supabase Tables

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the entire SQL schema from `CHAT_DATABASE_SCHEMA.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the schema

This creates the following tables:

- `chats` - Private 1-on-1 conversations
- `group_chats` - Group chat rooms
- `group_chat_members` - Group membership tracking
- `messages` - All messages (private and group)
- `read_receipts` - Message read status
- `message_reactions` - Emoji reactions on messages
- `typing_indicators` - Real-time typing status
- `user_presence` - Online/offline status

## Step 2: Update User Table (If Needed)

Make sure your `users` table in Supabase has the following columns:

- `id` (UUID) - Primary key
- `name` (VARCHAR) - User's display name
- `username` (VARCHAR) - User's username
- `imageUrl` (TEXT) - User's profile image URL

If you're missing any of these columns, add them to your users table.

## Step 3: Enable Realtime for Chat Tables

In Supabase Dashboard:

1. Go to Database > Replication
2. Enable Realtime for the following tables:
   - `messages`
   - `typing_indicators`
   - `user_presence`
   - `message_reactions`
   - `read_receipts`

## Step 4: Install Dependencies (If Needed)

The chat feature uses libraries that should already be in your project:

- `@supabase/supabase-js` - Already installed
- `@tanstack/react-query` - Already installed
- React built-in hooks

No additional npm packages are required!

## Step 5: File Structure

The chat feature has been integrated into your project:

```
src/
├── types/
│   └── chat.types.ts                  # Chat type definitions
├── lib/
│   ├── supabase/
│   │   └── chat-api.ts               # Supabase API functions for chat
│   └── react-query/
│       └── chat-queries.ts            # React Query hooks for chat
├── components/
│   └── chat/
│       ├── index.ts                   # Chat component exports
│       ├── MessageItem.tsx            # Individual message component
│       ├── MessageInput.tsx           # Message input with media upload
│       ├── ChatDetail.tsx             # Private chat view
│       ├── GroupChatDetail.tsx        # Group chat view
│       ├── CreateGroupChatModal.tsx   # Create group modal
│       ├── PrivateMessageModal.tsx    # Start private chat modal
│       └── ChatNotificationBadge.tsx  # Notification badge
├── _root/pages/
│   └── Chats.tsx                      # Main chats page
└── constants/
    └── index.ts                       # Updated with chat sidebar link
```

## Step 6: Test the Features

### Private Chat

1. Navigate to Messages in the sidebar
2. You should see the "Direct Messages" tab
3. Start a new chat by messaging a user from their profile (coming next)
4. Send and receive messages in real-time

### Group Chat

1. In Messages, click "New Group"
2. Create a group with name, description, and optional icon
3. Make groups public or private
4. Invite members by sharing the group
5. Admins can remove members and change group settings

### Advanced Features

- **Reactions**: Hover over a message and click the emoji button
- **Edit**: Click the pencil icon (own messages only)
- **Delete**: Click the trash icon (own messages only)
- **Media**: Use the attachment button to share images
- **Typing Indicator**: Others will see when you're typing
- **Read Receipts**: Check who has read messages
- **Online Status**: See who's online

## Step 7: Integration Points

### Adding Message Button to User Profiles

To add a "Message" button to user profiles, update the profile component:

```tsx
import { PrivateMessageModal } from "@/components/chat/PrivateMessageModal";

// In your user profile component:
const [showMessageModal, setShowMessageModal] = useState(false);

// Add this button:
<Button onClick={() => setShowMessageModal(true)}>Message</Button>;

{
  showMessageModal && (
    <PrivateMessageModal
      userId={user.id}
      userName={user.name}
      userImage={user.imageUrl}
      onClose={() => setShowMessageModal(false)}
    />
  );
}
```

## Step 8: Customization Options

### Change Chat Styles

- Update colors in `src/globals.css`
- Modify Tailwind classes in chat components
- Update the color scheme to match your design

### Modify Message Limit

- In `src/lib/react-query/chat-queries.ts`, update the `limit` parameter in query functions
- Change `limit: 50` to your desired value

### Add More Emoji Reactions

- Update `COMMON_EMOJIS` array in `src/components/chat/MessageItem.tsx`
- Add more emojis: `["👍", "❤️", "😂", "😮", "😢", "🔥", "✨", "🎉"]`

### Enable Notifications (Optional)

- Integrate with Supabase Notifications or a third-party service
- Use the `useUpdateUserPresence` hook to track online status
- Build a notification center component

## Step 9: Enable Full Real-time Experience

The chat uses Supabase Realtime for:

1. **New Messages**: Instant message delivery
2. **Typing Indicators**: See when others are typing
3. **Online Status**: Track who's online
4. **Message Reactions**: Real-time emoji reactions
5. **Read Receipts**: See when messages are read

All real-time features are automatically connected through the Supabase subscriptions.

## Step 10: Database Backups & Security

Consider:

1. **Set up backups** in Supabase for chat data
2. **Enable SSL** for secure connections
3. **Use RLS policies** (already configured in the schema)
4. **Monitor database usage** for performance optimization

## Troubleshooting

### Messages not showing

- Verify Supabase tables were created successfully
- Check browser console for errors
- Ensure user is authenticated

### Real-time not working

- Verify Realtime is enabled for message tables
- Check Supabase project status
- Try refreshing the page

### Group chat issues

- Ensure user is a member of the group
- Check that group admin has proper permissions
- Verify `group_chat_members` table has the user entry

### Media upload not working

- Check FileUploader component configuration
- Verify Supabase storage bucket exists
- Ensure proper file permissions

## API Reference

### Chat Functions

- `getOrCreatePrivateChat(otherUserId)` - Create/get private chat
- `sendMessage(content, chatId?, groupChatId?, mediaUrls?)` - Send message
- `editMessage(messageId, newContent)` - Edit own message
- `deleteMessage(messageId)` - Delete own message
- `createGroupChat(name, description, isPublic, iconUrl)` - Create group
- `joinGroupChat(groupChatId)` - Join public group
- `leaveGroupChat(groupChatId)` - Leave group
- `removeGroupMember(groupChatId, userId)` - Remove member (admin only)
- `addReaction(messageId, emoji)` - Add emoji reaction
- `removeReaction(messageId, emoji)` - Remove emoji reaction
- `markMessageAsRead(messageId)` - Mark as read
- `setTypingStatus(isTyping, chatId?, groupChatId?)` - Set typing status
- `updateUserPresence(isOnline)` - Update online status

## Next Steps

1. ✅ Run the SQL schema
2. ✅ Enable Realtime in Supabase
3. ✅ Test the chat features
4. ✅ Add message button to user profiles
5. ✅ Customize styling as needed
6. ✅ Deploy to production

## Support

If you encounter issues:

1. Check the Supabase console for error messages
2. Review browser console for JavaScript errors
3. Verify all tables were created with correct structure
4. Ensure Realtime is enabled for necessary tables
5. Check that user is properly authenticated

---

**Chat Feature Implementation Complete!** 🎉

Your Buddies app now has full messaging capabilities with real-time updates, group chats, and advanced message features.
