import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Shield, UserCheck, UserX, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SelectDropdown } from "@/components/select-dropdown";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { uploadAvatar } from "@/api/cloudinary/storage";

const ranks = [
  { label: "Major", value: "Major" },
  { label: "Captain", value: "Captain" },
  { label: "Lieutenant", value: "Lieutenant" },
  { label: "Subedar", value: "Subedar" },
  { label: "Naik", value: "Naik" },
  { label: "Sepoy", value: "Sepoy" },
];

const roles = [
  { label: "Adjutant", value: "adjt" },
  { label: "IT JCO", value: "it_jco" },
  { label: "User", value: "user" },
];

type User = {
  id?: string;
  uuid: string;
  name: string;
  email: string;
  role: string;
  rank: string;
  serviceNumber: string;
  unit: string;
  avatar?: string;
  isActive: boolean;
  createdAt: any;
};

export default function UserManagement() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rank: "",
    role: "user",
    serviceNumber: "",
    unit: "",
    isActive: true,
  });

  // Subscribe to real-time users
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let width = img.width;
          let height = img.height;
          const maxSize = 800;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image");
        return;
      }
      try {
        const compressedFile = await compressImage(file);
        setAvatarFile(compressedFile);
        setAvatarPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        toast.error("Failed to process image");
      }
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      rank: "",
      role: "user",
      serviceNumber: "",
      unit: "",
      isActive: true,
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditingUser(null);
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.rank || !formData.serviceNumber || !formData.unit) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Upload avatar if provided
      let avatarUrl = "";
      if (avatarFile) {
        try {
          avatarUrl = await uploadAvatar(user.uid, avatarFile);
        } catch (error) {
          console.error("Avatar upload failed:", error);
        }
      }

      // Create Firestore profile
      await setDoc(doc(db, "users", user.uid), {
        uuid: user.uid,
        email: formData.email,
        name: formData.name,
        rank: formData.rank,
        role: formData.role,
        serviceNumber: formData.serviceNumber,
        unit: formData.unit,
        avatar: avatarUrl || null,
        isActive: formData.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create user preferences
      await setDoc(doc(db, "user_preferences", user.uid), {
        userId: user.uid,
        theme: "system",
        colorScheme: "blue",
        fontFamily: "inter",
        notificationSettings: {
          messages: true,
          announcements: true,
          events: true,
          email: true,
          push: true,
        },
        updatedAt: serverTimestamp(),
      });

      toast.success("User created successfully");
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      console.error("Create user error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else {
        toast.error(error.message || "Failed to create user");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !formData.name || !formData.rank || !formData.serviceNumber || !formData.unit) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    try {
      let avatarUrl = editingUser.avatar;

      // Upload new avatar if changed
      if (avatarFile) {
        try {
          avatarUrl = await uploadAvatar(editingUser.uuid, avatarFile);
        } catch (error) {
          console.error("Avatar upload failed:", error);
        }
      }

      await updateDoc(doc(db, "users", editingUser.id!), {
        name: formData.name,
        rank: formData.rank,
        role: formData.role,
        serviceNumber: formData.serviceNumber,
        unit: formData.unit,
        avatar: avatarUrl,
        isActive: formData.isActive,
        updatedAt: serverTimestamp(),
      });

      toast.success("User updated successfully");
      setShowEditDialog(false);
      resetForm();
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.uuid === currentUser?.uuid) {
      toast.error("Cannot delete your own account");
      return;
    }

    if (!window.confirm(`Delete user ${user.name}?`)) return;

    try {
      await deleteDoc(doc(db, "users", user.id!));
      toast.success("User deleted successfully");
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      rank: user.rank,
      role: user.role,
      serviceNumber: user.serviceNumber,
      unit: user.unit,
      isActive: user.isActive,
    });
    setAvatarPreview(user.avatar || null);
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const openViewDialog = (user: User) => {
    setViewingUser(user);
    setShowViewDialog(true);
  };

  if (!canManage) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to manage users.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage unit personnel accounts</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    {user.avatar && <AvatarImage src={user.avatar} />}
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {user.rank}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openViewDialog(user)}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-mono">{user.serviceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Unit:</span>
                  <span>{user.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {user.isActive ? (
                    <Badge variant="default" className="text-xs">
                      <UserCheck className="h-3 w-3 mr-1" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <UserX className="h-3 w-3 mr-1" /> Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-3">
              <Label>Profile Picture (Optional)</Label>
              {avatarPreview ? (
                <div className="relative">
                  <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2" />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@unit.mil"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rank *</Label>
                <SelectDropdown
                  defaultValue={formData.rank}
                  onValueChange={(val) => setFormData({ ...formData, rank: val })}
                  items={ranks}
                  placeholder="Select rank"
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <SelectDropdown
                  defaultValue={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                  items={roles}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceNumber">Service Number *</Label>
                <Input
                  id="serviceNumber"
                  value={formData.serviceNumber}
                  onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                  placeholder="IC-12345"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="1st Battalion"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Account Active</Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={saving}>
              {saving ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-3">
              <Label>Profile Picture</Label>
              {avatarPreview ? (
                <div className="relative">
                  <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2" />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input id="edit-email" type="email" value={formData.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rank *</Label>
                <SelectDropdown
                  defaultValue={formData.rank}
                  onValueChange={(val) => setFormData({ ...formData, rank: val })}
                  items={ranks}
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <SelectDropdown
                  defaultValue={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                  items={roles}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-serviceNumber">Service Number *</Label>
                <Input
                  id="edit-serviceNumber"
                  value={formData.serviceNumber}
                  onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit *</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Account Active</Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={saving}>
              {saving ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-3">
                  {viewingUser.avatar && <AvatarImage src={viewingUser.avatar} />}
                  <AvatarFallback className="text-2xl">{viewingUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{viewingUser.name}</h3>
                <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank:</span>
                  <span className="font-medium">{viewingUser.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="outline">{viewingUser.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Number:</span>
                  <span className="font-mono">{viewingUser.serviceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit:</span>
                  <span>{viewingUser.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {viewingUser.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-sm">{viewingUser.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
