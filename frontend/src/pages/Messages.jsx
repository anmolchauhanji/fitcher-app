import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { chatApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  MessageSquare, 
  User, 
  Building2, 
  Clock, 
  AlertCircle,
  FolderOpen
} from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = user.role === 'customer' 
        ? await chatApi.getCustomerChats() 
        : await chatApi.getContractorChats();
      const list = res.data?.data || [];
      const sorted = [...list].sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      setChats(sorted);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load conversations.');
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await chatApi.getMessages(chatId);
      setMessages(res.data?.data || []);
      if (!silent) {
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Polling for new messages
  useEffect(() => {
    if (activeChat) {
      // Clear previous interval if any
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      // Fetch immediately
      fetchMessages(activeChat._id);
      chatApi.markChatRead(activeChat._id).catch(() => {});

      // Setup polling every 3 seconds
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(activeChat._id, true);
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageText = newMessage;
    setNewMessage('');
    try {
      const res = await chatApi.sendMessage(activeChat._id, {
        message: messageText,
        messageType: 'text'
      });
      // Append message locally to state instantly for visual speed
      setMessages((prev) => [...prev, res.data.data]);
      setTimeout(scrollToBottom, 50);
      // Refresh chats list to update lastMessage preview
      fetchChats();
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const getChatPartnerName = (chat) => {
    if (user.role === 'customer') {
      return chat.contractorId?.businessName || 'Verified Expert';
    } else {
      return chat.customerId?.name || 'Customer';
    }
  };

  const getUnreadCount = (chat) => Number(chat.unreadCount || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loadingChats) {
    return (
      <div className="pt-36 pb-20 px-4 md:px-6 max-w-6xl mx-auto h-[80vh] flex items-center justify-center page-enter">
        <div className="text-primary text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-20 px-4 md:px-6 max-w-6xl mx-auto page-enter">
      <div className="glass-card rounded-[2.5rem] border border-white/5 h-[70vh] flex overflow-hidden">
        {/* Sidebar chats list */}
        <div className="w-full md:w-80 border-r border-white/5 flex flex-col h-full bg-black/10">
          <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <MessageSquare className="text-primary" size={20} /> Chats
            </h1>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${
                    activeChat?._id === chat._id 
                      ? 'bg-primary/10 border border-primary/20 text-white' 
                      : 'hover:bg-white/[0.02] border border-transparent text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    user.role === 'customer' 
                      ? 'bg-primary/15 text-primary border border-primary/20' 
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  }`}>
                    {user.role === 'customer' ? <Building2 size={16} /> : <User size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm truncate text-white">
                        {getChatPartnerName(chat)}
                      </h4>
                      {getUnreadCount(chat) > 0 && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-black">{getUnreadCount(chat)}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center text-gray-600 py-10 text-xs">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col h-full bg-black/5">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/10">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    user.role === 'customer' ? 'bg-primary/15 text-primary' : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    {user.role === 'customer' ? <Building2 size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {getChatPartnerName(activeChat)}
                    </h3>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <FolderOpen size={10} /> Project: {activeChat.projectId?.title || 'Home Improvement'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-500">
                    Loading conversation...
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isOwnMessage = msg.senderId === user._id || msg.senderId?._id === user._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md rounded-2xl p-4 text-sm ${
                          isOwnMessage 
                            ? 'bg-primary text-black font-medium rounded-tr-none' 
                            : 'bg-surface border border-border text-white rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed break-words">{msg.message}</p>
                          <span className={`text-[9px] mt-1.5 block text-right ${
                            isOwnMessage ? 'text-black/60' : 'text-gray-500'
                          }`}>
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                    <MessageSquare size={28} className="text-gray-700 mb-2" />
                    <p className="text-xs">No messages yet. Send a greeting to start chatting!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/10 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none text-white text-sm"
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
              <MessageSquare size={44} className="text-gray-700 mb-4" />
              <p className="font-semibold text-gray-400">Select a Conversation</p>
              <p className="text-xs mt-1 text-gray-600">Choose a chat from the list to view project messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
