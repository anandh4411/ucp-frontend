import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Star,
  AlertCircle,
  Send,
  Paperclip,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import {
  subscribeToConversations,
  subscribeToMessages,
} from "@/api/firebase/realtime";
import {
  createConversation,
  sendMessage,
  updateMessage,
  deleteMessage,
  deleteConversation,
  markMessageAsRead,
  type Conversation,
  type Message,
  getUsers,
} from "@/api/firebase/firestore";
import { type UserProfile } from "@/api/firebase/auth";

export function MessagesPage() {
  const currentUser = getCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");

  // Firebase data
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Compose form state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeImportant, setComposeImportant] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Subscribe to conversations
  useEffect(() => {
    if (!currentUser?.uuid) return;

    const unsubscribe = subscribeToConversations(
      currentUser.uuid,
      (updatedConversations) => {
        setConversations(updatedConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uuid]);

  // Subscribe to messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(
      selectedConversation,
      (updatedMessages) => {
        setMessages(updatedMessages);
      }
    );

    return () => unsubscribe();
  }, [selectedConversation]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load users for compose dialog
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const allUsers = await getUsers({ isActive: true });
        setUsers(allUsers.filter((u) => u.uuid !== currentUser?.uuid));
      } catch (error: any) {
        console.error("Load users error:", error);
        const errorMsg = error?.message || "Failed to load users";
        setUsersError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, [currentUser?.uuid]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected conversation details
  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find((u) => u.uuid === userId);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Retry loading users
  const retryLoadUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const allUsers = await getUsers({ isActive: true });
      setUsers(allUsers.filter((u) => u.uuid !== currentUser?.uuid));
      toast.success("Users loaded successfully");
    } catch (error: any) {
      console.error("Retry load users error:", error);
      const errorMsg = error?.message || "Failed to load users";
      setUsersError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUsersLoading(false);
    }
  };

  // Mark messages as read when conversation is viewed
  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const markAllAsRead = async () => {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.senderId !== currentUser.uuid &&
          !msg.readBy.includes(currentUser.uuid)
      );

      for (const msg of unreadMessages) {
        if (msg.id) {
          try {
            await markMessageAsRead(
              selectedConversation,
              msg.id,
              currentUser.uuid
            );
          } catch (error) {
            console.error("Error marking message as read:", error);
          }
        }
      }
    };

    markAllAsRead();
  }, [selectedConversation, messages, currentUser]);

  // Get message status (for sent messages)
  const getMessageStatus = (message: Message) => {
    if (!selectedConv) return null;

    // Get other participants (exclude current user)
    const otherParticipants = selectedConv.participants.filter(
      (p) => p !== currentUser?.uuid
    );

    // Check if all other participants have read the message
    const allRead = otherParticipants.every((p) => message.readBy.includes(p));

    if (allRead && otherParticipants.length > 0) {
      return { icon: CheckCheck, text: "Seen", color: "text-blue-500" };
    }

    // Message delivered (has timestamp means it's saved in Firebase)
    if (message.timestamp) {
      return {
        icon: CheckCheck,
        text: "Delivered",
        color: "text-muted-foreground",
      };
    }

    // Message sent (has ID)
    if (message.id) {
      return { icon: Check, text: "Sent", color: "text-muted-foreground" };
    }

    return null;
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      if (editingMessage) {
        // Update existing message
        await updateMessage(
          selectedConversation,
          editingMessage.id!,
          messageText
        );
        setEditingMessage(null);
        setMessageText("");
        toast.success("Message updated successfully");
      } else {
        // Send new message
        await sendMessage(selectedConversation, {
          uuid: `msg-${Date.now()}`,
          conversationId: selectedConversation,
          senderId: currentUser?.uuid || "",
          content: messageText,
          isRead: false,
          readBy: [currentUser?.uuid || ""],
        });
        setMessageText("");
        toast.success("Message sent successfully");
      }
    } catch (error: any) {
      console.error("Send message error:", error);
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Check your Firebase security rules.");
      } else {
        toast.error(error.message || "Failed to send message");
      }
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setMessageText(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageText("");
  };

  const handleDeleteMessage = async (message: Message) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(selectedConversation!, message.id!);
      toast.success("Message deleted");
    } catch (error: any) {
      console.error("Delete message error:", error);
      if (error.code === "permission-denied") {
        toast.error(
          "Permission denied. You can only delete your own messages."
        );
      } else {
        toast.error(error.message || "Failed to delete message");
      }
    }
  };

  const handleDeleteConversation = async () => {
    if (!window.confirm("Delete this entire conversation?")) return;

    try {
      await deleteConversation(selectedConversation!);
      setSelectedConversation(null);
      toast.success("Conversation deleted");
    } catch (error: any) {
      console.error("Delete conversation error:", error);
      if (error.code === "permission-denied") {
        toast.error(
          "Permission denied. You can only delete conversations you created."
        );
      } else {
        toast.error(error.message || "Failed to delete conversation");
      }
    }
  };

  // Handle user selection (WhatsApp style)
  const handleUserSelect = async (userId: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find(
      (conv) =>
        conv.participants.includes(userId) &&
        conv.participants.includes(currentUser?.uuid || "") &&
        conv.participants.length === 2
    );

    if (existingConv) {
      // Open existing conversation
      setSelectedConversation(existingConv.id!);
      setComposeOpen(false);
      toast.info("Opening existing conversation");
    } else {
      // Start new conversation
      setComposeTo(userId);
    }
  };

  // Handle compose new message
  const handleComposeSubmit = async () => {
    if (!composeTo || !composeSubject.trim() || !composeMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      const conversationId = await createConversation({
        uuid: `conv-${Date.now()}`,
        participants: [currentUser?.uuid || "", composeTo],
        subject: composeSubject,
        lastMessage: {
          content: composeMessage,
          timestamp: new Date(),
          senderId: currentUser?.uuid || "",
        },
        unreadCount: 1,
        isImportant: composeImportant,
        isUrgent: false,
      });

      await sendMessage(conversationId, {
        uuid: `msg-${Date.now()}`,
        conversationId,
        senderId: currentUser?.uuid || "",
        content: composeMessage,
        isRead: false,
        readBy: [currentUser?.uuid || ""],
      });

      toast.success("Message sent successfully");
      setComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeMessage("");
      setComposeImportant(false);
      setUserSearchQuery("");
      setSelectedConversation(conversationId);
    } catch (error: any) {
      console.error("Compose message error:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Filter users for search in compose dialog
  const filteredUsers = users.filter((user) => {
    if (!userSearchQuery.trim()) return true; // Show all users when search is empty
    const searchLower = userSearchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.rank?.toLowerCase().includes(searchLower) ||
      user.serviceNumber?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Get selected user details
  const selectedUser = users.find((u) => u.uuid === composeTo);

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Secure unit communications</p>
        </div>
        <Button onClick={() => setComposeOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>

      {/* Messages Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden px-4 pb-4">
        {/* Conversations List */}
        <Card className="col-span-4 flex flex-col min-h-0">
          <div className="p-4 border-b space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2 space-y-1">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConversation === conv.id;
                  const otherParticipantId = conv.participants.find(
                    (p) => p !== currentUser?.uuid
                  );
                  const otherParticipant = getUserById(
                    otherParticipantId || ""
                  );
                  const participantName = otherParticipant
                    ? `${otherParticipant.rank} ${otherParticipant.name}`
                    : usersLoading
                    ? "Loading..."
                    : "Unknown User";

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id!)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                            {getInitials(otherParticipant?.name || "Unknown")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate min-w-0 flex-1">
                              {participantName}
                            </span>
                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                              {conv.lastMessage?.timestamp?.toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <p className="text-sm truncate flex-1 font-semibold text-foreground min-w-0">
                              {conv.subject}
                            </p>
                            {conv.isUrgent && (
                              <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />
                            )}
                            {conv.isImportant && (
                              <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.content}
                          </p>

                          {conv.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="mt-2 text-xs h-5 px-2"
                            >
                              {conv.unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-8 flex flex-col min-h-0 gap-0">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const otherParticipantId = selectedConv.participants.find(
                        (p) => p !== currentUser?.uuid
                      );
                      const otherParticipant = getUserById(
                        otherParticipantId || ""
                      );
                      return (
                        <>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                              {getInitials(otherParticipant?.name || "Unknown")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-semibold">
                                {selectedConv.subject}
                              </h2>
                              {selectedConv.isUrgent && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Urgent
                                </Badge>
                              )}
                              {selectedConv.isImportant && (
                                <Badge variant="default" className="text-xs">
                                  Important
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {selectedConv.participants
                                .map((p) => {
                                  const user = getUserById(p);
                                  return user
                                    ? `${user.rank} ${user.name}`
                                    : "Unknown";
                                })
                                .join(", ")}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleDeleteConversation}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 min-h-0 px-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isCurrentUser =
                        message.senderId === currentUser?.uuid;
                      const sender = getUserById(message.senderId);
                      const senderName = sender
                        ? `${sender.rank} ${sender.name}`
                        : usersLoading
                        ? "Loading..."
                        : "Unknown User";

                      return (
                        <div
                          key={message.id}
                          className={`flex group ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              isCurrentUser ? "order-2" : "order-1"
                            }`}
                          >
                            <div className="relative">
                              <div
                                className={`rounded-lg p-3 ${
                                  isCurrentUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {!isCurrentUser && (
                                  <p className="text-xs font-semibold mb-1.5 opacity-70">
                                    {senderName}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              </div>
                              {isCurrentUser && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-background/80 hover:bg-background"
                                    onClick={() => handleEditMessage(message)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-background/80 hover:bg-background"
                                    onClick={() => handleDeleteMessage(message)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <p className="text-xs text-muted-foreground">
                                {message.timestamp?.toLocaleString()}
                              </p>
                              {isCurrentUser &&
                                (() => {
                                  const status = getMessageStatus(message);
                                  if (!status) return null;
                                  const StatusIcon = status.icon;
                                  return (
                                    <div
                                      className={`flex items-center gap-0.5 ${status.color}`}
                                    >
                                      <StatusIcon className="h-3 w-3" />
                                    </div>
                                  );
                                })()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Reply Input */}
              <div className="p-3 border-t">
                {editingMessage && (
                  <div className="flex items-center justify-between mb-2 p-2 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">
                      Editing message
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message... (Ctrl+Enter to send)"
                    className="min-h-20 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sending}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={sending || !messageText.trim()}
                    >
                      {sending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a conversation to view messages
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Dialog - WhatsApp Style */}
      <Dialog
        open={composeOpen}
        onOpenChange={(open) => {
          setComposeOpen(open);
          if (!open) {
            setComposeTo("");
            setComposeSubject("");
            setComposeMessage("");
            setComposeImportant(false);
            setUserSearchQuery("");
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] p-0">
          {!composeTo ? (
            /* User Selection Screen */
            <>
              <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Select a person to start chatting
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, rank, or service number..."
                    className="pl-9"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="p-2">
                  {usersLoading ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Loading users...
                      </p>
                    </div>
                  ) : usersError ? (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-sm text-destructive">{usersError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={retryLoadUsers}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user.uuid}
                        onClick={() => handleUserSelect(user.uuid)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <Avatar className="h-11 w-11 flex-shrink-0">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium truncate">
                            {user.rank} {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.serviceNumber}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            /* Message Composition Screen */
            <>
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setComposeTo("");
                      setComposeSubject("");
                      setComposeMessage("");
                      setComposeImportant(false);
                    }}
                  >
                    ←
                  </Button>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {getInitials(selectedUser?.name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-left">
                        {selectedUser?.rank} {selectedUser?.name}
                      </DialogTitle>
                      <DialogDescription className="text-left">
                        {selectedUser?.serviceNumber}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Message subject"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[150px] resize-none"
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="important"
                    checked={composeImportant}
                    onChange={(e) => setComposeImportant(e.target.checked)}
                    className="rounded h-4 w-4"
                  />
                  <Label htmlFor="important" className="text-sm cursor-pointer">
                    Mark as important
                  </Label>
                </div>
              </div>

              <DialogFooter className="p-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setComposeTo("");
                    setComposeSubject("");
                    setComposeMessage("");
                    setComposeImportant(false);
                  }}
                  disabled={sending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleComposeSubmit}
                  disabled={
                    sending || !composeSubject.trim() || !composeMessage.trim()
                  }
                >
                  {sending && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {sending ? "Sending..." : "Send Message"}
                  {!sending && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
