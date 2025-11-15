import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrCreatePrivateChat,
  getPrivateChats,
  getPrivateChatMessages,
  createGroupChat,
  getGroupChats,
  getGroupChatById,
  joinGroupChat,
  leaveGroupChat,
  removeGroupMember,
  updateGroupChat,
  sendMessage,
  editMessage,
  deleteMessage,
  getGroupChatMessages,
  markMessageAsRead,
  getMessageReadReceipts,
  addReaction,
  removeReaction,
  getMessageReactions,
  setTypingStatus,
  updateUserPresence,
  getUserPresence,
} from "@/lib/supabase/chat-api";

const chatKeys = {
  all: ["chats"],
  privateChats: ["privateChats"],
  groupChats: ["groupChats"],
  messages: ["messages"],
  reactions: ["reactions"],
  readReceipts: ["readReceipts"],
  presence: ["presence"],
  typing: ["typing"],
};

// ============ PRIVATE CHATS ============

export const useGetOrCreatePrivateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otherUserId: string) => getOrCreatePrivateChat(otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.privateChats });
    },
  });
};

export const useGetPrivateChats = () => {
  return useQuery({
    queryKey: chatKeys.privateChats,
    queryFn: getPrivateChats,
    refetchInterval: 5000,
  });
};

export const useGetPrivateChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: [...chatKeys.messages, chatId],
    queryFn: () => getPrivateChatMessages(chatId),
    enabled: !!chatId,
    refetchInterval: 2000,
  });
};

// ============ GROUP CHATS ============

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      name: string;
      description?: string;
      isPublic?: boolean;
      iconUrl?: string;
    }) => createGroupChat(params.name, params.description, params.isPublic, params.iconUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.groupChats });
    },
  });
};

export const useGetGroupChats = () => {
  return useQuery({
    queryKey: chatKeys.groupChats,
    queryFn: getGroupChats,
    refetchInterval: 5000,
  });
};

export const useGetGroupChatById = (groupChatId: string) => {
  return useQuery({
    queryKey: [...chatKeys.groupChats, groupChatId],
    queryFn: () => getGroupChatById(groupChatId),
    enabled: !!groupChatId,
  });
};

export const useJoinGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupChatId: string) => joinGroupChat(groupChatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.groupChats });
    },
  });
};

export const useLeaveGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupChatId: string) => leaveGroupChat(groupChatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.groupChats });
    },
  });
};

export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupChatId: string; userId: string }) =>
      removeGroupMember(params.groupChatId, params.userId),
    onSuccess: (_, { groupChatId }) => {
      queryClient.invalidateQueries({
        queryKey: [...chatKeys.groupChats, groupChatId],
      });
    },
  });
};

export const useUpdateGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      groupChatId: string;
      updates: Record<string, any>;
    }) => updateGroupChat(params.groupChatId, params.updates),
    onSuccess: (_, { groupChatId }) => {
      queryClient.invalidateQueries({
        queryKey: [...chatKeys.groupChats, groupChatId],
      });
    },
  });
};

// ============ MESSAGES ============

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      content: string;
      chatId?: string;
      groupChatId?: string;
      mediaUrls?: string[];
    }) =>
      sendMessage(
        params.content,
        params.chatId,
        params.groupChatId,
        params.mediaUrls
      ),
    onSuccess: (message) => {
      if (message.chat_id) {
        queryClient.invalidateQueries({
          queryKey: [...chatKeys.messages, message.chat_id],
        });
      } else if (message.group_chat_id) {
        queryClient.invalidateQueries({
          queryKey: [...chatKeys.messages, message.group_chat_id],
        });
      }
      queryClient.invalidateQueries({ queryKey: chatKeys.privateChats });
      queryClient.invalidateQueries({ queryKey: chatKeys.groupChats });
    },
  });
};

export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { messageId: string; newContent: string }) =>
      editMessage(params.messageId, params.newContent),
    onSuccess: (message) => {
      if (message.chat_id) {
        queryClient.invalidateQueries({
          queryKey: [...chatKeys.messages, message.chat_id],
        });
      } else if (message.group_chat_id) {
        queryClient.invalidateQueries({
          queryKey: [...chatKeys.messages, message.group_chat_id],
        });
      }
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages });
    },
  });
};

export const useGetGroupChatMessages = (groupChatId: string) => {
  return useQuery({
    queryKey: [...chatKeys.messages, groupChatId],
    queryFn: () => getGroupChatMessages(groupChatId),
    enabled: !!groupChatId,
    refetchInterval: 2000,
  });
};

// ============ READ RECEIPTS ============

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => markMessageAsRead(messageId),
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({
        queryKey: [...chatKeys.readReceipts, messageId],
      });
    },
  });
};

export const useGetMessageReadReceipts = (messageId: string) => {
  return useQuery({
    queryKey: [...chatKeys.readReceipts, messageId],
    queryFn: () => getMessageReadReceipts(messageId),
    enabled: !!messageId,
  });
};

// ============ MESSAGE REACTIONS ============

export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { messageId: string; emoji: string }) =>
      addReaction(params.messageId, params.emoji),
    onSuccess: (_, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: [...chatKeys.reactions, messageId],
      });
    },
  });
};

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { messageId: string; emoji: string }) =>
      removeReaction(params.messageId, params.emoji),
    onSuccess: (_, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: [...chatKeys.reactions, messageId],
      });
    },
  });
};

export const useGetMessageReactions = (messageId: string) => {
  return useQuery({
    queryKey: [...chatKeys.reactions, messageId],
    queryFn: () => getMessageReactions(messageId),
    enabled: !!messageId,
  });
};

// ============ TYPING INDICATORS ============

export const useSetTypingStatus = () => {
  return useMutation({
    mutationFn: (params: {
      isTyping: boolean;
      chatId?: string;
      groupChatId?: string;
    }) =>
      setTypingStatus(params.isTyping, params.chatId, params.groupChatId),
  });
};

// ============ USER PRESENCE ============

export const useUpdateUserPresence = () => {
  return useMutation({
    mutationFn: (isOnline: boolean) => updateUserPresence(isOnline),
  });
};

export const useGetUserPresence = (userId: string) => {
  return useQuery({
    queryKey: [...chatKeys.presence, userId],
    queryFn: () => getUserPresence(userId),
    enabled: !!userId,
    refetchInterval: 5000,
  });
};
