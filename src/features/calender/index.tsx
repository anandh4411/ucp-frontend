import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { subscribeToEvents } from "@/api/firebase/realtime";
import { createEvent, updateEvent, deleteEvent, type CalendarEvent } from "@/api/firebase/firestore";

// Dummy data
const eventsData = [
  {
    id: "1",
    title: "Monthly Parade",
    description:
      "All personnel required to attend monthly parade in full ceremonial uniform.",
    startTime: "2024-11-15T08:00:00Z",
    endTime: "2024-11-15T10:00:00Z",
    location: "Main Parade Ground",
    category: "ceremony",
    attendees: ["1", "2", "3"],
    organizer: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    isMandatory: true,
    isAllDay: false,
  },
  {
    id: "2",
    title: "Physical Training",
    description: "Morning PT session - obstacle course training.",
    startTime: "2024-11-10T06:00:00Z",
    endTime: "2024-11-10T07:30:00Z",
    location: "PT Ground",
    category: "training",
    attendees: ["2", "3"],
    organizer: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    isMandatory: true,
    isAllDay: false,
  },
  {
    id: "3",
    title: "Weapons Training Workshop",
    description: "Advanced weapons handling and maintenance training.",
    startTime: "2024-11-12T09:00:00Z",
    endTime: "2024-11-12T16:00:00Z",
    location: "Training Hall A",
    category: "training",
    attendees: ["1", "3"],
    organizer: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    isMandatory: false,
    isAllDay: false,
  },
  {
    id: "4",
    title: "System Maintenance",
    description: "Portal maintenance window - all services offline.",
    startTime: "2024-11-10T02:00:00Z",
    endTime: "2024-11-10T06:00:00Z",
    location: "IT Center",
    category: "maintenance",
    attendees: ["2"],
    organizer: {
      id: "2",
      name: "Subedar Amit Singh",
      rank: "Subedar",
    },
    isMandatory: false,
    isAllDay: false,
  },
  {
    id: "5",
    title: "Medical Inspection",
    description: "Annual medical examination for all personnel.",
    startTime: "2024-11-18T00:00:00Z",
    endTime: "2024-11-18T23:59:59Z",
    location: "Medical Center",
    category: "administrative",
    attendees: ["1", "2", "3"],
    organizer: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    isMandatory: true,
    isAllDay: true,
  },
  {
    id: "6",
    title: "Equipment Inspection",
    description: "Quarterly equipment and gear inspection.",
    startTime: "2024-11-20T10:00:00Z",
    endTime: "2024-11-20T14:00:00Z",
    location: "Armory",
    category: "inspection",
    attendees: ["1", "2", "3"],
    organizer: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    isMandatory: true,
    isAllDay: false,
  },
  {
    id: "7",
    title: "Leadership Meeting",
    description: "Monthly leadership coordination meeting.",
    startTime: "2024-11-22T14:00:00Z",
    endTime: "2024-11-22T16:00:00Z",
    location: "Conference Room",
    category: "meeting",
    attendees: ["1", "2"],
    organizer: {
      id: "1",
      name: "Major Rajesh Kumar",
      rank: "Major",
    },
    isMandatory: true,
    isAllDay: false,
  },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Training", value: "training" },
  { label: "Ceremony", value: "ceremony" },
  { label: "Meeting", value: "meeting" },
  { label: "Inspection", value: "inspection" },
  { label: "Administrative", value: "administrative" },
  { label: "Maintenance", value: "maintenance" },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    training:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ceremony:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    meeting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    inspection:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    administrative:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[category] || colors.administrative;
};

export default function Calendar() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "list">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState("training");
  const [formMandatory, setFormMandatory] = useState(false);
  const [formAllDay, setFormAllDay] = useState(false);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number) => {
    return eventsData.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Filter events
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Upcoming events (future only)
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.startTime) > new Date()
  );

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle view event
  const handleView = (event: any) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    if (
      !formTitle.trim() ||
      !formStartDate ||
      !formEndDate ||
      !formLocation.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Event created successfully");
    setCreateDialogOpen(false);
    resetForm();
    // In real app: await api.createEvent()
  };

  // Handle edit
  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description);
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    setFormStartDate(startDate.toISOString().split("T")[0]);
    setFormStartTime(startDate.toTimeString().slice(0, 5));
    setFormEndDate(endDate.toISOString().split("T")[0]);
    setFormEndTime(endDate.toTimeString().slice(0, 5));
    setFormLocation(event.location);
    setFormCategory(event.category);
    setFormMandatory(event.isMandatory);
    setFormAllDay(event.isAllDay);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (
      !formTitle.trim() ||
      !formStartDate ||
      !formEndDate ||
      !formLocation.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Event updated successfully");
    setEditDialogOpen(false);
    resetForm();
    // In real app: await api.updateEvent()
  };

  // Handle delete
  const handleDelete = (event: any) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success("Event deleted successfully");
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
    // In real app: await api.deleteEvent()
  };

  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormStartDate("");
    setFormStartTime("");
    setFormEndDate("");
    setFormEndTime("");
    setFormLocation("");
    setFormCategory("training");
    setFormMandatory(false);
    setFormAllDay(false);
    setSelectedEvent(null);
  };

  // Render calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={day}
          className={`min-h-24 p-2 border rounded-lg transition-colors ${
            isTodayDate
              ? "bg-primary/5 border-primary"
              : "hover:bg-muted/50 border-border"
          }`}
        >
          <div
            className={`text-sm font-semibold mb-1 ${
              isTodayDate ? "text-primary" : ""
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <button
                key={event.id}
                onClick={() => handleView(event)}
                className={`w-full text-left text-xs p-1 rounded truncate ${getCategoryColor(
                  event.category
                )}`}
              >
                {formatTime(event.startTime)} {event.title}
              </button>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground pl-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Unit events and schedules</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")}>
        <TabsList>
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        {/* Month View */}
        <TabsContent value="month" className="space-y-4">
          {/* Calendar Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
            </CardContent>
          </Card>

          {/* Upcoming Events Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleView(event)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{event.title}</p>
                            {event.isMandatory && (
                              <Badge variant="destructive" className="text-xs">
                                Mandatory
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(event.startTime)} •{" "}
                              {formatTime(event.startTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
                    className={
                      selectedCategory === cat.value ? "bg-accent" : ""
                    }
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Events List */}
          {sortedEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedEvents.map((event) => (
                <Card key={event.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-primary/10 p-3 rounded-lg text-center min-w-16">
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.startTime).toLocaleDateString(
                              "en-US",
                              { month: "short" }
                            )}
                          </div>
                          <div className="text-2xl font-bold">
                            {new Date(event.startTime).getDate()}
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              {event.isMandatory && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Mandatory
                                </Badge>
                              )}
                              <Badge
                                className={getCategoryColor(event.category)}
                              >
                                {event.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.isAllDay
                                ? "All Day"
                                : `${formatTime(
                                    event.startTime
                                  )} - ${formatTime(event.endTime)}`}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} attending
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(event)}
                        >
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
                                onClick={() => handleEdit(event)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(event)}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className={getCategoryColor(selectedEvent.category)}>
                      {selectedEvent.category}
                    </Badge>
                    {selectedEvent.isMandatory && (
                      <Badge variant="destructive">Mandatory</Badge>
                    )}
                    {selectedEvent.isAllDay && (
                      <Badge variant="secondary">All Day</Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Start</p>
                        <p className="text-muted-foreground">
                          {formatDate(selectedEvent.startTime)}
                          {!selectedEvent.isAllDay &&
                            ` • ${formatTime(selectedEvent.startTime)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">End</p>
                        <p className="text-muted-foreground">
                          {formatDate(selectedEvent.endTime)}
                          {!selectedEvent.isAllDay &&
                            ` • ${formatTime(selectedEvent.endTime)}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Attendees</p>
                        <p className="text-muted-foreground">
                          {selectedEvent.attendees.length} personnel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-t">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                      {getInitials(selectedEvent.organizer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      Organized by {selectedEvent.organizer.rank}{" "}
                      {selectedEvent.organizer.name}
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
              {editDialogOpen ? "Edit Event" : "Create Event"}
            </DialogTitle>
            <DialogDescription>
              {editDialogOpen
                ? "Update event details"
                : "Schedule a new unit event"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Event title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Event description..."
                className="min-h-[80px] resize-none"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  disabled={formAllDay}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  disabled={formAllDay}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                placeholder="Event location"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
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

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>All Day Event</Label>
                <p className="text-xs text-muted-foreground">
                  Event lasts the entire day
                </p>
              </div>
              <input
                type="checkbox"
                checked={formAllDay}
                onChange={(e) => setFormAllDay(e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Mandatory Attendance</Label>
                <p className="text-xs text-muted-foreground">
                  All personnel required to attend
                </p>
              </div>
              <input
                type="checkbox"
                checked={formMandatory}
                onChange={(e) => setFormMandatory(e.target.checked)}
                className="rounded"
              />
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
              {editDialogOpen ? "Update" : "Create"} Event
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
              Delete Event
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This
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
