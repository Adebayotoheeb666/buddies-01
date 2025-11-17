import { supabase } from "./config";
import {
  IChat,
  IGroupChat,
  IMessage,
  IReadReceipt,
  IMessageReaction,
  ChatWithLastMessage,
  GroupChatWithMembers,
} from "@/types/chat.types";

// ============ PRIVATE CHATS ============

export const getOrCreatePrivateChat = async (
  otherUserId: string
): Promise<IChat> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const userId1 = user.id < otherUserId ? user.id : otherUserId;
  const userId2 = user.id > otherUserId ? user.id : otherUserId;

  const { data: existingChat } = await supabase
    .from("chats")
    .select("*")
    .eq("user1_id", userId1)
    .eq("user2_id", userId2)
    .single();

  if (existingChat) return existingChat;

  const { data: newChat, error } = await supabase
    .from("chats")
    .insert([{ user1_id: userId1, user2_id: userId2 }])
    .select()
    .single();

  if (error) throw error;
  return newChat;
};

export const getPrivateChats = async (): Promise<ChatWithLastMessage[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  try {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        messages(id, content, sender_id, created_at, is_deleted)
      `
      )
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) {
      const errorDetails = {
        code: (error as any).code || "UNKNOWN",
        message: (error as any).message || String(error),
        details: (error as any).details,
        hint: (error as any).hint,
        status: (error as any).status,
      };
      console.error(
        "getPrivateChats error:",
        JSON.stringify(errorDetails, null, 2)
      );
      // Return empty array on error instead of throwing to prevent infinite retries
      return [];
    }

    if (!data) return [];

    // Fetch user details for other participants
    const chatsWithUsers = await Promise.all(
      data.map(async (chat: any) => {
        try {
          const otherUserId =
            chat.user1_id === user.id ? chat.user2_id : chat.user1_id;
          const { data: userData } = await supabase
            .from("users")
            .select("id, name, imageUrl, username")
            .eq("id", otherUserId)
            .single();

          return {
            ...chat,
            otherUser: userData,
          };
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn("Error fetching user details for chat:", errorMsg);
          return chat;
        }
      })
    );

    return chatsWithUsers;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getPrivateChats exception:", errorMsg);
    // Return empty array on error instead of throwing to prevent infinite retries
    return [];
  }
};

export const getPrivateChatMessages = async (
  chatId: string,
  limit: number = 50
): Promise<IMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      read_receipts(*),
      message_reactions(*)
    `
    )
    .eq("chat_id", chatId)
    .is("group_chat_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data.reverse();
};

// ============ GROUP CHATS ============

export const createGroupChat = async (
  name: string,
  description?: string,
  isPublic: boolean = false,
  iconUrl?: string
): Promise<IGroupChat> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("group_chats")
    .insert([
      {
        name,
        description,
        created_by_id: user.id,
        icon_url: iconUrl,
        is_public: isPublic,
        member_count: 1,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Add creator as admin
  await supabase.from("group_chat_members").insert([
    {
      group_chat_id: data.id,
      user_id: user.id,
      role: "admin",
    },
  ]);

  return data;
};

export const getGroupChats = async (): Promise<GroupChatWithMembers[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  try {
    const { data, error } = await supabase
      .from("group_chats")
      .select(
        `
        *,
        group_chat_members(id, user_id, role, joined_at)
      `
      )
      .eq("group_chat_members.user_id", user.id);

    if (error) {
      const errorDetails = {
        code: (error as any).code || "UNKNOWN",
        message: (error as any).message || String(error),
        details: (error as any).details,
        hint: (error as any).hint,
        status: (error as any).status,
      };
      console.error(
        "getGroupChats error:",
        JSON.stringify(errorDetails, null, 2)
      );
      // Return empty array on error instead of throwing to prevent infinite retries
      return [];
    }

    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getGroupChats exception:", errorMsg);
    // Return empty array on error instead of throwing to prevent infinite retries
    return [];
  }
};

export const getGroupChatById = async (
  groupChatId: string
): Promise<GroupChatWithMembers> => {
  const { data, error } = await supabase
    .from("group_chats")
    .select(
      `
      *,
      group_chat_members(id, user_id, role, joined_at)
    `
    )
    .eq("id", groupChatId)
    .single();

  if (error) throw error;
  return data;
};

export const joinGroupChat = async (groupChatId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error: memberError } = await supabase
    .from("group_chat_members")
    .insert([
      {
        group_chat_id: groupChatId,
        user_id: user.id,
        role: "member",
      },
    ]);

  if (memberError) throw memberError;

  // Update member count
  const { data: groupChat } = await supabase
    .from("group_chats")
    .select("member_count")
    .eq("id", groupChatId)
    .single();

  if (groupChat) {
    await supabase
      .from("group_chats")
      .update({ member_count: (groupChat.member_count || 0) + 1 })
      .eq("id", groupChatId);
  }
};

export const leaveGroupChat = async (groupChatId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("group_chat_members")
    .delete()
    .eq("group_chat_id", groupChatId)
    .eq("user_id", user.id);

  if (error) throw error;

  // Update member count
  const { data: groupChat } = await supabase
    .from("group_chats")
    .select("member_count")
    .eq("id", groupChatId)
    .single();

  if (groupChat) {
    await supabase
      .from("group_chats")
      .update({ member_count: Math.max(0, (groupChat.member_count || 1) - 1) })
      .eq("id", groupChatId);
  }
};

export const removeGroupMember = async (
  groupChatId: string,
  userId: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Check if user is admin
  const { data: memberData } = await supabase
    .from("group_chat_members")
    .select("role")
    .eq("group_chat_id", groupChatId)
    .eq("user_id", user.id)
    .single();

  if (memberData?.role !== "admin") {
    throw new Error("Only admins can remove members");
  }

  const { error } = await supabase
    .from("group_chat_members")
    .delete()
    .eq("group_chat_id", groupChatId)
    .eq("user_id", userId);

  if (error) throw error;

  // Update member count
  const { data: groupChat } = await supabase
    .from("group_chats")
    .select("member_count")
    .eq("id", groupChatId)
    .single();

  if (groupChat) {
    await supabase
      .from("group_chats")
      .update({ member_count: Math.max(0, (groupChat.member_count || 1) - 1) })
      .eq("id", groupChatId);
  }
};

export const updateGroupChat = async (
  groupChatId: string,
  updates: Partial<IGroupChat>
): Promise<IGroupChat> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Check if user is admin
  const { data: memberData } = await supabase
    .from("group_chat_members")
    .select("role")
    .eq("group_chat_id", groupChatId)
    .eq("user_id", user.id)
    .single();

  if (memberData?.role !== "admin") {
    throw new Error("Only admins can update group settings");
  }

  const { data, error } = await supabase
    .from("group_chats")
    .update(updates)
    .eq("id", groupChatId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============ MESSAGES ============

export const sendMessage = async (
  content: string,
  chatId?: string,
  groupChatId?: string,
  mediaUrls?: string[]
): Promise<IMessage> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");
  if (!chatId && !groupChatId)
    throw new Error("Either chatId or groupChatId required");

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        chat_id: chatId || null,
        group_chat_id: groupChatId || null,
        sender_id: user.id,
        content,
        media_urls: mediaUrls || [],
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update chat's last_message_at
  if (chatId) {
    await supabase
      .from("chats")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", chatId);
  }

  return data;
};

export const editMessage = async (
  messageId: string,
  newContent: string
): Promise<IMessage> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .update({
      content: newContent,
      is_edited: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageId)
    .eq("sender_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("messages")
    .update({
      is_deleted: true,
      deleted_by_id: user.id,
      content: "[Message deleted]",
    })
    .eq("id", messageId)
    .eq("sender_id", user.id);

  if (error) throw error;
};

export const getGroupChatMessages = async (
  groupChatId: string,
  limit: number = 50
): Promise<IMessage[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      read_receipts(*),
      message_reactions(*)
    `
    )
    .eq("group_chat_id", groupChatId)
    .is("chat_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data.reverse();
};

// ============ READ RECEIPTS ============

export const markMessageAsRead = async (
  messageId: string
): Promise<IReadReceipt> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("read_receipts")
    .insert([{ message_id: messageId, user_id: user.id }])
    .select()
    .single();

  if (error && error.code !== "23505") throw error; // 23505 is unique constraint violation

  return data;
};

export const getMessageReadReceipts = async (
  messageId: string
): Promise<IReadReceipt[]> => {
  const { data, error } = await supabase
    .from("read_receipts")
    .select(
      `
      *,
      users:user_id(id, name, imageUrl)
    `
    )
    .eq("message_id", messageId);

  if (error) throw error;
  return data;
};

// ============ MESSAGE REACTIONS ============

export const addReaction = async (
  messageId: string,
  emoji: string
): Promise<IMessageReaction> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("message_reactions")
    .insert([{ message_id: messageId, user_id: user.id, emoji }])
    .select()
    .single();

  if (error && error.code !== "23505") throw error;

  return data;
};

export const removeReaction = async (
  messageId: string,
  emoji: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("message_reactions")
    .delete()
    .eq("message_id", messageId)
    .eq("user_id", user.id)
    .eq("emoji", emoji);

  if (error) throw error;
};

export const getMessageReactions = async (
  messageId: string
): Promise<IMessageReaction[]> => {
  const { data, error } = await supabase
    .from("message_reactions")
    .select("*")
    .eq("message_id", messageId);

  if (error) throw error;
  return data;
};

// ============ TYPING INDICATORS ============

export const setTypingStatus = async (
  isTyping: boolean,
  chatId?: string,
  groupChatId?: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  if (isTyping) {
    await supabase.from("typing_indicators").insert([
      {
        chat_id: chatId || null,
        group_chat_id: groupChatId || null,
        user_id: user.id,
      },
    ]);
  } else {
    await supabase
      .from("typing_indicators")
      .delete()
      .eq("user_id", user.id)
      .or(
        `chat_id.eq.${chatId || null},group_chat_id.eq.${groupChatId || null}`
      );
  }
};

// ============ USER PRESENCE ============

export const updateUserPresence = async (isOnline: boolean): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from("user_presence").upsert(
    [
      {
        user_id: user.id,
        is_online: isOnline,
        last_seen_at: new Date().toISOString(),
      },
    ],
    { onConflict: "user_id" }
  );

  if (error) throw error;
};

export const getUserPresence = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_presence")
    .select("is_online")
    .eq("user_id", userId)
    .single();

  if (error) return false;
  return data?.is_online || false;
};
