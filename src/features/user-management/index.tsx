import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { SelectDropdown } from "@/components/select-dropdown";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  selectColumn,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table/helpers/column-helpers";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import usersData from "@/data/users.json";

// Ranks dropdown options
const ranks = [
  { label: "Major", value: "major" },
  { label: "Captain", value: "captain" },
  { label: "Lieutenant", value: "lieutenant" },
  { label: "Subedar Major", value: "subedar_major" },
  { label: "Subedar", value: "subedar" },
  { label: "Naib Subedar", value: "naib_subedar" },
  { label: "Havildar", value: "havildar" },
  { label: "Naik", value: "naik" },
  { label: "Lance Naik", value: "lance_naik" },
  { label: "Sepoy", value: "sepoy" },
];

const roles = [
  { label: "Adjutant", value: "adjt" },
  { label: "IT JCO", value: "it_jco" },
  { label: "User", value: "user" },
];

type User = {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: string;
  rank: string;
  serviceNumber: string;
  unit: string;
  isActive: boolean;
  createdAt: string;
};

export default function UserManagement() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  // Redirect if not authorized
  if (!canManage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center">
              You don't have permission to access user management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRank, setFormRank] = useState("");
  const [formServiceNumber, setFormServiceNumber] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formActive, setFormActive] = useState(true);

  // Table state
  const tableState = useTableState<User>({ debounceMs: 300 });

  // Filter users
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const searchLower = tableState.state.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.rank.toLowerCase().includes(searchLower) ||
        user.serviceNumber.toLowerCase().includes(searchLower)
      );
    });
  }, [tableState.state.search]);

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role badge variant
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "adjt":
        return { label: "Adjutant", variant: "default" as const };
      case "it_jco":
        return { label: "IT JCO", variant: "secondary" as const };
      default:
        return { label: "User", variant: "outline" as const };
    }
  };

  // Handle view
  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    if (
      !formName.trim() ||
      !formEmail.trim() ||
      !formRank ||
      !formServiceNumber.trim() ||
      !formUnit.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if email exists
    if (usersData.some((u) => u.email === formEmail)) {
      toast.error("Email already exists");
      return;
    }

    // Check if service number exists
    if (usersData.some((u) => u.serviceNumber === formServiceNumber)) {
      toast.error("Service number already exists");
      return;
    }

    toast.success("User created successfully");
    setCreateDialogOpen(false);
    resetForm();
    // In real app: await api.createUser()
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRank(user.rank);
    setFormServiceNumber(user.serviceNumber);
    setFormUnit(user.unit);
    setFormRole(user.role);
    setFormActive(user.isActive);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (
      !formName.trim() ||
      !formEmail.trim() ||
      !formRank ||
      !formServiceNumber.trim() ||
      !formUnit.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("User updated successfully");
    setEditDialogOpen(false);
    resetForm();
    // In real app: await api.updateUser()
  };

  // Handle delete
  const handleDelete = (user: User) => {
    // Prevent self-deletion
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success("User deleted successfully");
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    // In real app: await api.deleteUser()
  };

  // Handle toggle status
  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    const newStatus = !user.isActive;
    toast.success(
      `User ${newStatus ? "activated" : "deactivated"} successfully`
    );
    // In real app: await api.toggleUserStatus(user.id)
  };

  // Reset form
  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRank("");
    setFormServiceNumber("");
    setFormUnit("");
    setFormRole("user");
    setFormActive(true);
    setSelectedUser(null);
  };

  // Define columns
  const createColumns = (
    onView: (user: User) => void,
    onEdit: (user: User) => void,
    onDelete: (user: User) => void,
    onToggleStatus: (user: User) => void
  ): ColumnDef<User>[] => {
    return [
      selectColumn<User>(),

      customColumn<User>("name", "Name", (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {getInitials(value || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.rank}</div>
          </div>
        </div>
      )),

      customColumn<User>("email", "Email", (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )),

      customColumn<User>("serviceNumber", "Service Number", (value) => (
        <span className="font-mono text-sm">{value}</span>
      )),

      customColumn<User>("unit", "Unit", (value) => (
        <div className="flex items-center gap-2">
          <Building className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )),

      customColumn<User>("role", "Role", (value) => {
        const badge = getRoleBadge(value);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      }),

      customColumn<User>("isActive", "Status", (value, row) => (
        <div className="flex items-center gap-2">
          <Badge variant={value ? "default" : "secondary"}>
            {value ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => onToggleStatus(row)}
          >
            {value ? (
              <UserX className="h-3 w-3" />
            ) : (
              <UserCheck className="h-3 w-3" />
            )}
          </Button>
        </div>
      )),

      // Custom actions column
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(user)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  };

  const columns = useMemo(
    () =>
      createColumns(handleView, handleEdit, handleDelete, handleToggleStatus),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage unit personnel accounts and permissions
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{usersData.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">
                  {usersData.filter((u) => u.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold">
                  {
                    usersData.filter(
                      (u) => u.role === "adjt" || u.role === "it_jco"
                    ).length
                  }
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive Users</p>
                <p className="text-2xl font-bold">
                  {usersData.filter((u) => !u.isActive).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers as User[]}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search users by name, email, or service number...",
            columnKey: "name",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "name", desc: false },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No users found.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedUser.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {selectedUser.rank}
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleBadge(selectedUser.role).variant}>
                      {getRoleBadge(selectedUser.role).label}
                    </Badge>
                    <Badge
                      variant={selectedUser.isActive ? "default" : "secondary"}
                    >
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground">
                      Service Number:
                    </span>
                    <p className="font-medium font-mono mt-1">
                      {selectedUser.serviceNumber}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Unit:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{selectedUser.unit}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <p className="font-medium mt-1">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Permissions</h4>
                  <div className="space-y-2">
                    {selectedUser.role === "adjt" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Full administrative access</span>
                      </div>
                    )}
                    {selectedUser.role === "it_jco" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>User management and system administration</span>
                      </div>
                    )}
                    {selectedUser.role === "user" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Standard user access</span>
                      </div>
                    )}
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
                {selectedUser.id !== currentUser?.id && (
                  <Button onClick={() => handleEdit(selectedUser)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                )}
              </DialogFooter>
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
              {editDialogOpen ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editDialogOpen
                ? "Update user account details"
                : "Create a new user account for unit personnel"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@unit.army"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rank *</Label>
                <SelectDropdown
                  placeholder="Select rank"
                  items={ranks}
                  defaultValue={formRank}
                  onValueChange={setFormRank}
                />
              </div>

              <div className="space-y-2">
                <Label>Service Number *</Label>
                <Input
                  placeholder="e.g. IC-45678"
                  className="font-mono"
                  value={formServiceNumber}
                  onChange={(e) => setFormServiceNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unit *</Label>
              <Input
                placeholder="e.g. 2nd Battalion"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <SelectDropdown
                placeholder="Select role"
                items={roles}
                defaultValue={formRole}
                onValueChange={setFormRole}
              />
              <p className="text-xs text-muted-foreground">
                Determines user permissions and access level
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  User can access the portal
                </p>
              </div>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
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
              {editDialogOpen ? "Update" : "Create"} User
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
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.name}"? This
              action cannot be undone and will remove all associated data.
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
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
