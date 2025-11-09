import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";

// Dummy data
const announcementsData = [
  {
    id: "1",
    title: "Monthly Parade - All Personnel Required",
    content:
      "All unit personnel are required to attend the monthly parade on 15th November 2024 at 0800 hrs. Full ceremonial uniform mandatory. Parade will be followed by address from Commanding Officer.",
    author: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    createdAt: "2024-11-09T08:00:00Z",
    priority: "urgent",
    isPinned: true,
    category: "event",
    readBy: ["3"],
  },
  {
    id: "2",
    title: "System Maintenance Scheduled",
    content:
      "The Unit Communication Portal will undergo scheduled maintenance on Sunday, 10th November from 0200 hrs to 0600 hrs. All services will be temporarily unavailable during this period.",
    author: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    createdAt: "2024-11-08T14:00:00Z",
    priority: "high",
    isPinned: true,
    category: "technical",
    readBy: [],
  },
  {
    id: "3",
    title: "New Training Manual Available",
    content:
      "Updated training manual for weapon handling is now available in the Resources section. All personnel must complete review by end of month.",
    author: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    createdAt: "2024-11-07T10:30:00Z",
    priority: "normal",
    isPinned: false,
    category: "training",
    readBy: ["3"],
  },
  {
    id: "4",
    title: "Leave Application Deadline",
    content:
      "All leave applications for December must be submitted by 20th November. Late applications will not be entertained except in emergency cases.",
    author: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    createdAt: "2024-11-06T09:00:00Z",
    priority: "normal",
    isPinned: false,
    category: "administrative",
    readBy: ["2", "3"],
  },
  {
    id: "5",
    title: "Physical Training Schedule Updated",
    content:
      "New PT schedule effective from next week. Morning sessions will now start at 0530 hrs instead of 0600 hrs. Evening sessions remain unchanged.",
    author: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    createdAt: "2024-11-05T16:00:00Z",
    priority: "normal",
    isPinned: false,
    category: "training",
    readBy: ["3"],
  },
];

const categories = [
  { label: "Event", value: "event" },
  { label: "Training", value: "training" },
  { label: "Administrative", value: "administrative" },
  { label: "Technical", value: "technical" },
  { label: "General", value: "general" },
];

const priorities = [
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

export default function Announcements() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formPriority, setFormPriority] = useState("normal");
  const [formPinned, setFormPinned] = useState(false);

  // Filter announcements
  const filteredAnnouncements = announcementsData.filter((ann) =>
    ann.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      default:
        return "secondary";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      event: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      training:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      administrative:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      technical:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category] || colors.general;
  };

  // Check if announcement is read by current user
  const isRead = (announcement: any) => {
    return announcement.readBy?.includes(currentUser?.id);
  };

  // Handle view announcement
  const handleView = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setViewDialogOpen(true);
    // Mark as read
    if (!isRead(announcement)) {
      toast.success("Marked as read");
      // In real app: await api.markAnnouncementAsRead(announcement.id)
    }
  };

  // Handle create
  const handleCreate = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Announcement created successfully");
    setCreateDialogOpen(false);
    resetForm();
    // In real app: await api.createAnnouncement()
  };

  // Handle edit
  const handleEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setFormTitle(announcement.title);
    setFormContent(announcement.content);
    setFormCategory(announcement.category);
    setFormPriority(announcement.priority);
    setFormPinned(announcement.isPinned);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Announcement updated successfully");
    setEditDialogOpen(false);
    resetForm();
    // In real app: await api.updateAnnouncement()
  };

  // Handle delete
  const handleDelete = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success("Announcement deleted successfully");
    setDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
    // In real app: await api.deleteAnnouncement()
  };

  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCategory("general");
    setFormPriority("normal");
    setFormPinned(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Unit-wide notices and updates</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`transition-all hover:shadow-md ${
                !isRead(announcement) ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {announcement.isPinned && (
                      <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg leading-tight">
                          {announcement.title}
                        </h3>
                        {!isRead(announcement) && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getPriorityColor(announcement.priority)}
                          className="text-xs"
                        >
                          {announcement.priority}
                        </Badge>
                        <Badge
                          className={`text-xs ${getCategoryColor(
                            announcement.category
                          )}`}
                        >
                          {announcement.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {announcement.author.rank} {announcement.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {announcement.readBy?.length || 0} read
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(announcement)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(announcement)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(announcement)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAnnouncement.isPinned && (
                    <Pin className="h-5 w-5 text-primary" />
                  )}
                  {selectedAnnouncement.title}
                </DialogTitle>
                <DialogDescription className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge
                      variant={getPriorityColor(selectedAnnouncement.priority)}
                    >
                      {selectedAnnouncement.priority}
                    </Badge>
                    <Badge
                      className={getCategoryColor(
                        selectedAnnouncement.category
                      )}
                    >
                      {selectedAnnouncement.category}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 border-y">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                        {getInitials(selectedAnnouncement.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedAnnouncement.author.rank}{" "}
                        {selectedAnnouncement.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          selectedAnnouncement.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAnnouncement.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                    <Eye className="h-3 w-3" />
                    <span>
                      Read by {selectedAnnouncement.readBy?.length || 0}{" "}
                      personnel
                    </span>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? "Edit Announcement" : "Create Announcement"}
            </DialogTitle>
            <DialogDescription>
              {editDialogOpen
                ? "Update announcement details"
                : "Create a new unit-wide announcement"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Announcement title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                >
                  {priorities.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                placeholder="Announcement content..."
                className="min-h-[200px] resize-none"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Pin Announcement</Label>
                <p className="text-xs text-muted-foreground">
                  Pinned announcements appear at the top
                </p>
              </div>
              <Switch checked={formPinned} onCheckedChange={setFormPinned} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={editDialogOpen ? handleUpdate : handleCreate}>
              {editDialogOpen ? "Update" : "Create"} Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Announcement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
