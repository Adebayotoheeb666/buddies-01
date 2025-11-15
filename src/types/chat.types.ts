export interface IChat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
}

export interface IGroupChat {
  id: string;
  name: string;
  description?: string;
  created_by_id: string;
  icon_url?: string;
  is_public: boolean;
  member_count: number;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface IGroupChatMember {
  id: string;
  group_chat_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface IMessage {
  id: string;
  chat_id?: string;
  group_chat_id?: string;
  sender_id: string;
  content: string;
  media_urls?: string[];
  is_edited: boolean;
  is_deleted: boolean;
  deleted_by_id?: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    imageUrl?: string;
    username: string;
  };
  reactions?: IMessageReaction[];
  read_by?: IReadReceipt[];
}

export interface IReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  user?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface IMessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface ITypingIndicator {
  id: string;
  chat_id?: string;
  group_chat_id?: string;
  user_id: string;
  created_at: string;
}

export interface IUserPresence {
  id: string;
  user_id: string;
  is_online: boolean;
  last_seen_at: string;
}

export interface ChatWithLastMessage extends IChat {
  lastMessage?: IMessage;
  otherUser?: {
    id: string;
    name: string;
    imageUrl?: string;
    username: string;
  };
}

export interface GroupChatWithMembers extends IGroupChat {
  members?: IGroupChatMember[];
  creator?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}
