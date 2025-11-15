-- Create chats table (for private 1-on-1 conversations)
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

-- Create group_chats table
CREATE TABLE IF NOT EXISTS group_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  icon_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create group_chat_members table
CREATE TABLE IF NOT EXISTS group_chat_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_chat_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'admin' or 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_chat_id, user_id)
);

-- Create messages table (for both private and group messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((chat_id IS NOT NULL AND group_chat_id IS NULL) OR (chat_id IS NULL AND group_chat_id IS NOT NULL))
);

-- Create read_receipts table
CREATE TABLE IF NOT EXISTS read_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id)
);

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id, emoji)
);

-- Create typing_indicators table (for real-time typing status)
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((chat_id IS NOT NULL AND group_chat_id IS NULL) OR (chat_id IS NULL AND group_chat_id IS NOT NULL))
);

-- Create user_presence table (for online/offline status)
CREATE TABLE IF NOT EXISTS user_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_chats_user1_id ON chats(user1_id);
CREATE INDEX idx_chats_user2_id ON chats(user2_id);
CREATE INDEX idx_chats_last_message_at ON chats(last_message_at DESC NULLS LAST);
CREATE INDEX idx_group_chats_created_by_id ON group_chats(created_by_id);
CREATE INDEX idx_group_chat_members_user_id ON group_chat_members(user_id);
CREATE INDEX idx_group_chat_members_group_chat_id ON group_chat_members(group_chat_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_group_chat_id ON messages(group_chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_read_receipts_message_id ON read_receipts(message_id);
CREATE INDEX idx_read_receipts_user_id ON read_receipts(user_id);
CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX idx_typing_indicators_chat_id ON typing_indicators(chat_id);
CREATE INDEX idx_typing_indicators_group_chat_id ON typing_indicators(group_chat_id);

-- Enable Row Level Security (RLS)
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON chats
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for group_chats
CREATE POLICY "Users can view group chats they are members of" ON group_chats
  FOR SELECT USING (
    id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid())
    OR is_public = TRUE
  );

CREATE POLICY "Users can create group chats" ON group_chats
  FOR INSERT WITH CHECK (auth.uid() = created_by_id);

-- RLS Policies for group_chat_members
CREATE POLICY "Users can view group members they share a group with" ON group_chat_members
  FOR SELECT USING (
    group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can join groups" ON group_chat_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their chats" ON messages
  FOR SELECT USING (
    (chat_id IN (SELECT id FROM chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
    OR (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can send messages to their chats" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = deleted_by_id);

-- RLS Policies for read_receipts
CREATE POLICY "Users can view read receipts for their messages" ON read_receipts
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
      OR (chat_id IN (SELECT id FROM chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
      OR (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can mark messages as read" ON read_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for message_reactions
CREATE POLICY "Users can view message reactions" ON message_reactions
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM messages WHERE
      (chat_id IN (SELECT id FROM chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
      OR (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can add reactions" ON message_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON message_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for typing_indicators
CREATE POLICY "Users can view typing indicators" ON typing_indicators
  FOR SELECT USING (
    (chat_id IN (SELECT id FROM chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
    OR (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can set their own typing status" ON typing_indicators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_presence
CREATE POLICY "Users can view all user presence" ON user_presence
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own presence" ON user_presence
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence on update" ON user_presence
  FOR UPDATE USING (auth.uid() = user_id);
