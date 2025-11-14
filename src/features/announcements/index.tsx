import { useState, useEffect } from "react";
import { Plus, Search, Pin, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/select-dropdown";
import { getCurrentUser } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import { subscribeToAnnouncements } from "@/api/firebase/realtime";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, incrementAnnouncementView, type Announcement } from "@/api/firebase/firestore";
import { Spinner } from "@/components/ui/spinner";
import { SkeletonCard } from "@/components/ui/loading-skeletons";

const priorityOptions = [
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

const categoryOptions = [
  { label: "Event", value: "event" },
  { label: "Training", value: "training" },
  { label: "Administrative", value: "administrative" },
  { label: "Technical", value: "technical" },
  { label: "General", value: "general" },
];

export default function Announcements() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "adjt" || currentUser?.role === "it_jco";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
    category: "general",
    isPinned: false,
  });

  // Subscribe to real-time announcements
  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements(
      (updatedAnnouncements: Announcement[]) => {
        setAnnouncements(updatedAnnouncements);
        setLoading(false);
      },
      {}
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "normal",
      category: "general",
      isPinned: false,
    });
    setEditingAnnouncement(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      if (editingAnnouncement) {
        // Update existing - use doc ID not uuid
        await updateAnnouncement(editingAnnouncement.id!, {
          title: formData.title,
          content: formData.content,
          priority: formData.priority as "normal" | "high" | "urgent",
          category: formData.category as "event" | "training" | "administrative" | "technical" | "general",
          isPinned: formData.isPinned,
        });
        toast.success("Announcement updated successfully");
      } else {
        // Create new
        await createAnnouncement({
          uuid: `ann-${Date.now()}`,
          title: formData.title,
          content: formData.content,
          priority: formData.priority as "normal" | "high" | "urgent",
          category: formData.category as "event" | "training" | "administrative" | "technical" | "general",
          isPinned: formData.isPinned,
          authorId: currentUser?.uuid || "",
          readBy: [],
        });
        toast.success("Announcement created successfully");
      }
      closeDialog();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      // Use doc ID not uuid
      await deleteAnnouncement(announcement.id!);
      toast.success("Announcement deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete announcement");
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      isPinned: announcement.isPinned,
    });
    setEditingAnnouncement(announcement);
    setShowCreateDialog(true);
  };

  const openViewDialog = async (announcement: Announcement) => {
    setViewingAnnouncement(announcement);
    setShowViewDialog(true);

    // Increment view count
    if (announcement.id) {
      try {
        await incrementAnnouncementView(announcement.id);
      } catch (error) {
        console.error("Error incrementing view count:", error);
        // Don't show error to user, this is a background operation
      }
    }
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setShowViewDialog(false);
    resetForm();
    setViewingAnnouncement(null);
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 w-48 bg-accent animate-pulse rounded" />
            <div className="h-4 w-64 bg-accent animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard showHeader lines={4} />
          <SkeletonCard showHeader lines={4} />
          <SkeletonCard showHeader lines={4} />
          <SkeletonCard showHeader lines={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">View and manage unit announcements</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4" /> Pinned Announcements
          </h2>
          {pinnedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isAdmin={isAdmin}
              onView={openViewDialog}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-3">
        {pinnedAnnouncements.length > 0 && <h2 className="text-lg font-semibold">All Announcements</h2>}
        {regularAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            isAdmin={isAdmin}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            getPriorityColor={getPriorityColor}
          />
        ))}
        {filteredAnnouncements.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No announcements found</p>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit" : "Create"} Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Announcement content"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <SelectDropdown
                  defaultValue={formData.priority}
                  onValueChange={(val) => setFormData({ ...formData, priority: val })}
                  items={priorityOptions}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <SelectDropdown
                  defaultValue={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                  items={categoryOptions}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="pinned" className="cursor-pointer">
                Pin this announcement
              </Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdate} disabled={saving} isLoading={saving}>
              {editingAnnouncement ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge variant={getPriorityColor(viewingAnnouncement?.priority || "normal")}>
                {viewingAnnouncement?.priority}
              </Badge>
              <Badge variant="outline">{viewingAnnouncement?.category}</Badge>
              {viewingAnnouncement?.isPinned && (
                <Badge variant="secondary">
                  <Pin className="h-3 w-3 mr-1" /> Pinned
                </Badge>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{viewingAnnouncement?.content}</p>
            <div className="text-xs text-muted-foreground">
              Posted on {viewingAnnouncement?.createdAt?.toLocaleDateString()}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Announcement Card Component - Military Style
function AnnouncementCard({
  announcement,
  isAdmin,
  onView,
  onEdit,
  onDelete,
  getPriorityColor,
}: {
  announcement: Announcement;
  isAdmin: boolean;
  onView: (a: Announcement) => void;
  onEdit: (a: Announcement) => void;
  onDelete: (a: Announcement) => void;
  getPriorityColor: (priority: string) => "destructive" | "default" | "secondary";
}) {
  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-destructive";
      case "high": return "border-l-primary";
      default: return "border-l-border";
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${getPriorityBorderColor(announcement.priority)} relative overflow-hidden`} onClick={() => onView(announcement)}>
      {announcement.priority === "urgent" && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-destructive text-destructive-foreground text-xs font-bold py-1 right-[-35px] top-[10px] w-[100px] text-center shadow-sm">
            URGENT
          </div>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {announcement.isPinned && <Pin className="h-4 w-4 text-primary" />}
              <h3 className="font-bold text-lg tracking-tight">{announcement.title}</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <Badge variant={getPriorityColor(announcement.priority)} className="font-semibold uppercase text-xs">{announcement.priority}</Badge>
              <Badge variant="outline" className="uppercase text-xs">{announcement.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(announcement);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(announcement);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(announcement);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          Posted {announcement.createdAt?.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
