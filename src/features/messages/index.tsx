import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Star,
  AlertCircle,
  Send,
  Paperclip,
  MoreVertical,
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
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/select-dropdown";
import messagesData from "@/data/messages.json";
import usersData from "@/data/users.json";
import { getCurrentUser } from "@/guards/useAuthGuard";
import { toast } from "sonner";

export function MessagesPage() {
  const currentUser = getCurrentUser();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");

  // Compose form state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeImportant, setComposeImportant] = useState(false);

  const conversations = messagesData.conversations;
  const messageThreads = messagesData.messageThreads;

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected conversation details
  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const selectedThread = selectedConversation
    ? messageThreads[selectedConversation as keyof typeof messageThreads]
    : [];

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    toast.success("Message sent successfully");
    setMessageText("");
    // In real app: await api.sendMessage()
  };

  // Handle compose new message
  const handleComposeSubmit = () => {
    if (!composeTo || !composeSubject.trim() || !composeMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Message sent successfully");
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeMessage("");
    setComposeImportant(false);
    // In real app: await api.createMessage()
  };

  // Users for compose dropdown (exclude current user)
  const availableUsers = usersData
    .filter((u) => u.id !== currentUser?.id && u.isActive)
    .map((u) => ({
      label: `${u.rank} ${u.name}`,
      value: u.id,
    }));

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Conversations List */}
        <Card className="col-span-4 flex flex-col">
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

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const isSelected = selectedConversation === conv.id;
                const otherParticipant = conv.participants.find(
                  (p) => p.id !== currentUser?.id
                );

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                          {getInitials(otherParticipant?.name || "UN")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate">
                            {otherParticipant?.rank} {otherParticipant?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              conv.lastMessage.timestamp
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm truncate flex-1 ${
                              conv.isRead
                                ? "text-muted-foreground"
                                : "font-semibold text-foreground"
                            }`}
                          >
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
                          {conv.lastMessage.content}
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
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-8 flex flex-col">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                        {getInitials(
                          selectedConv.participants.find(
                            (p) => p.id !== currentUser?.id
                          )?.name || "UN"
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">
                          {selectedConv.subject}
                        </h2>
                        {selectedConv.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
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
                          .map((p) => `${p.rank} ${p.name}`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedThread.map((message) => {
                    const isCurrentUser = message.senderId === currentUser?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isCurrentUser ? "order-2" : "order-1"
                          }`}
                        >
                          {!isCurrentUser && (
                            <p className="text-xs font-medium mb-1">
                              {message.senderRank} {message.senderName}
                            </p>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Reply Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[80px] resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
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

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Send a secure message to unit personnel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>To</Label>
              <SelectDropdown
                placeholder="Select recipient"
                items={availableUsers}
                onValueChange={setComposeTo}
                defaultValue={undefined}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Message subject"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message..."
                className="min-h-[120px] resize-none"
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
                className="rounded"
              />
              <Label htmlFor="important" className="text-sm cursor-pointer">
                Mark as important
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleComposeSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
