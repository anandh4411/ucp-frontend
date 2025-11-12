import { useState, useEffect } from "react";
import {
  FolderOpen,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  File,
  FileText,
  Image,
  Video,
  Archive,
  AlertCircle,
  Upload,
  User,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import { subscribeToResources } from "@/api/firebase/realtime";
import {
  createResource,
  deleteResource,
  incrementResourceDownloads,
  type Resource,
} from "@/api/firebase/firestore";
import { uploadFile, getFileType, formatFileSize } from "@/api/firebase/storage";
import { getUsers } from "@/api/firebase/firestore";

// Dummy data
const resourcesData = [
  {
    id: "1",
    title: "Weapon Handling Manual 2024",
    description:
      "Comprehensive guide for proper weapon handling, maintenance, and safety protocols.",
    fileName: "weapon_manual_2024.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    category: "training",
    uploadedBy: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    uploadedAt: "2024-11-07T10:30:00Z",
    downloads: 45,
    tags: ["weapons", "training", "safety"],
  },
  {
    id: "2",
    title: "PT Schedule November 2024",
    description:
      "Updated physical training schedule for the month of November.",
    fileName: "pt_schedule_nov_2024.xlsx",
    fileSize: "156 KB",
    fileType: "spreadsheet",
    category: "schedules",
    uploadedBy: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    uploadedAt: "2024-11-05T16:00:00Z",
    downloads: 67,
    tags: ["pt", "schedule", "fitness"],
  },
  {
    id: "3",
    title: "First Aid Training Video",
    description:
      "Video demonstration of basic first aid procedures for field emergencies.",
    fileName: "first_aid_training.mp4",
    fileSize: "125 MB",
    fileType: "video",
    category: "training",
    uploadedBy: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    uploadedAt: "2024-11-03T14:20:00Z",
    downloads: 89,
    tags: ["medical", "training", "emergency"],
  },
  {
    id: "4",
    title: "Leave Application Form",
    description: "Standard leave application form template for all personnel.",
    fileName: "leave_application_form.docx",
    fileSize: "45 KB",
    fileType: "document",
    category: "forms",
    uploadedBy: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    uploadedAt: "2024-11-01T09:00:00Z",
    downloads: 123,
    tags: ["forms", "leave", "administrative"],
  },
  {
    id: "5",
    title: "Unit Deployment Map",
    description: "Tactical deployment map for exercise operations.",
    fileName: "deployment_map_oct_2024.png",
    fileSize: "3.8 MB",
    fileType: "image",
    category: "operations",
    uploadedBy: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    uploadedAt: "2024-10-28T11:45:00Z",
    downloads: 34,
    tags: ["operations", "tactical", "map"],
  },
  {
    id: "6",
    title: "SOPs Archive 2023",
    description:
      "Complete collection of Standard Operating Procedures from 2023.",
    fileName: "sops_2023.zip",
    fileSize: "15.2 MB",
    fileType: "archive",
    category: "documentation",
    uploadedBy: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    uploadedAt: "2024-10-25T08:30:00Z",
    downloads: 28,
    tags: ["sops", "procedures", "archive"],
  },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Training", value: "training" },
  { label: "Schedules", value: "schedules" },
  { label: "Forms", value: "forms" },
  { label: "Operations", value: "operations" },
  { label: "Documentation", value: "documentation" },
];

const fileTypes = [
  { label: "All Types", value: "all" },
  { label: "Documents", value: "document" },
  { label: "Spreadsheets", value: "spreadsheet" },
  { label: "PDFs", value: "pdf" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Archives", value: "archive" },
];

export default function Resources() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Firebase data
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("training");
  const [formTags, setFormTags] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

  // Subscribe to resources
  useEffect(() => {
    const unsubscribe = subscribeToResources(
      (updatedResources) => {
        setResources(updatedResources);
        setLoading(false);
      },
      { category: selectedCategory !== "all" ? selectedCategory : undefined }
    );

    return () => unsubscribe();
  }, [selectedCategory]);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getUsers({});
        setUsers(allUsers);
      } catch (error) {
        console.error("Load users error:", error);
      }
    };
    loadUsers();
  }, []);

  const getUserById = (userId: string) => {
    return users.find((u) => u.uuid === userId);
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFileType =
      selectedFileType === "all" || resource.fileType === selectedFileType;

    return matchesSearch && matchesFileType;
  });

  const sortedResources = [...filteredResources];

  // Get file icon
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return FileText;
      case "document":
      case "spreadsheet":
        return FileText;
      case "image":
        return Image;
      case "video":
        return Video;
      case "archive":
        return Archive;
      default:
        return File;
    }
  };

  // Get file type badge color
  const getFileTypeColor = (fileType: string) => {
    const colors: Record<string, string> = {
      pdf: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      document: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      spreadsheet:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      image:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      video:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      archive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[fileType] || colors.document;
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle view
  const handleView = (resource: Resource) => {
    setSelectedResource(resource);
    setViewDialogOpen(true);
  };

  // Handle download
  const handleDownload = async (resource: Resource) => {
    try {
      await incrementResourceDownloads(resource.id!);
      window.open(resource.fileUrl, "_blank");
      toast.success(`Downloading ${resource.fileName}`);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download file");
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!formTitle.trim() || !formDescription.trim() || !formFile) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const filePath = `resources/${Date.now()}_${formFile.name}`;
      const fileUrl = await uploadFile(formFile, filePath, (progress) => {
        setUploadProgress(progress.progress);
      });

      await createResource({
        uuid: `res-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        fileName: formFile.name,
        fileUrl,
        fileSize: formFile.size,
        fileType: getFileType(formFile.name) as any,
        category: formCategory as any,
        uploadedById: currentUser?.uuid || "",
        tags: formTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });

      toast.success("Resource uploaded successfully");
      setUploadDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload resource");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;

    try {
      await deleteResource(selectedResource.id!);
      toast.success("Resource deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedResource(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete resource");
    }
  };

  const openDeleteDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Resource updated successfully");
    setEditDialogOpen(false);
    resetForm();
    // In real app: await api.updateResource()
  };

  const confirmDelete = async () => {
    await handleDelete();
  };

  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("training");
    setFormTags("");
    setFormFile(null);
    setSelectedResource(null);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Shared documents and training materials
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resource
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Category
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? "bg-accent" : ""}
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Type
                {selectedFileType !== "all" && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {fileTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => setSelectedFileType(type.value)}
                  className={selectedFileType === type.value ? "bg-accent" : ""}
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || selectedFileType !== "all") && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setSelectedCategory("all")}
            >
              {categories.find((c) => c.value === selectedCategory)?.label}
              <span className="ml-1">×</span>
            </Badge>
          )}
          {selectedFileType !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setSelectedFileType("all")}
            >
              {fileTypes.find((t) => t.value === selectedFileType)?.label}
              <span className="ml-1">×</span>
            </Badge>
          )}
        </div>
      )}

      {/* Resources Grid */}
      {sortedResources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedResources.map((resource) => {
            const FileIcon = getFileIcon(resource.fileType);

            return (
              <Card
                key={resource.id}
                className="transition-all hover:shadow-md group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight truncate">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.fileName}
                        </p>
                      </div>
                    </div>

                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedResource(resource);
                              setFormTitle(resource.title);
                              setFormDescription(resource.description);
                              setFormCategory(resource.category);
                              setFormTags(resource.tags.join(", "));
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(resource)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-2 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">
                        {getUserById(resource.uploadedById)?.rank || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleView(resource)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedResource && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {(() => {
                    const FileIcon = getFileIcon(selectedResource.fileType);
                    return (
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                    );
                  })()}
                  {selectedResource.title}
                </DialogTitle>
                <DialogDescription>
                  <Badge
                    className={`mt-2 ${getFileTypeColor(
                      selectedResource.fileType
                    )}`}
                  >
                    {selectedResource.fileType.toUpperCase()}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">File Name:</span>
                    <p className="font-medium break-all">
                      {selectedResource.fileName}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">File Size:</span>
                    <p className="font-medium">{selectedResource.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium capitalize">
                      {selectedResource.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Downloads:</span>
                    <p className="font-medium">{selectedResource.downloads}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">
                    Description:
                  </span>
                  <p className="text-sm mt-1">{selectedResource.description}</p>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedResource.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-t">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                      {getInitials(getUserById(selectedResource.uploadedById)?.name || "Unknown")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {getUserById(selectedResource.uploadedById)?.rank || "Unknown"}{" "}
                      {getUserById(selectedResource.uploadedById)?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on{" "}
                      {selectedResource.createdAt?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={() => handleDownload(selectedResource)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload/Edit Dialog */}
      <Dialog
        open={uploadDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setUploadDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? "Edit Resource" : "Upload Resource"}
            </DialogTitle>
            <DialogDescription>
              {editDialogOpen
                ? "Update resource details"
                : "Upload a new resource for unit personnel"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Resource title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Brief description of the resource..."
                className="min-h-[100px] resize-none"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="training, manual, safety (comma-separated)"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>

            {!editDialogOpen && (
              <div className="space-y-2">
                <Label>File *</Label>
                <div className="border-2 border-dashed rounded-lg p-6">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {formFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {formFile.name} (
                      {(formFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={editDialogOpen ? handleUpdate : handleUpload}>
              {editDialogOpen ? "Update" : "Upload"} Resource
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
              Delete Resource
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedResource?.title}"? This
              action cannot be undone.
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
