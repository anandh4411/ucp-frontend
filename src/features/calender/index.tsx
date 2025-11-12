import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";
import { subscribeToEvents } from "@/api/firebase/realtime";
import { createEvent, updateEvent, deleteEvent, type CalendarEvent } from "@/api/firebase/firestore";

const categories = [
  { label: "Training", value: "training", color: "bg-purple-600" },
  { label: "Ceremony", value: "ceremony", color: "bg-sky-400" },
  { label: "Meeting", value: "meeting", color: "bg-emerald-600" },
  { label: "Inspection", value: "inspection", color: "bg-yellow-500" },
  { label: "Administrative", value: "administrative", color: "bg-blue-600" },
  { label: "Maintenance", value: "maintenance", color: "bg-red-600" },
];

const getCategoryColor = (category: string) => {
  const cat = categories.find((c) => c.value === category);
  return cat?.color || "bg-gray-600";
};

export default function Calendar() {
  const currentUser = getCurrentUser();
  const canManage = hasRole(["adjt", "it_jco"]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showDayEventsDialog, setShowDayEventsDialog] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    category: "training",
    isMandatory: false,
    isAllDay: false,
  });

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (updatedEvents: CalendarEvent[]) => {
        setEvents(updatedEvents);
        setLoading(false);
      },
      {}
    );

    return () => unsubscribe();
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPrevious = () => {
    if (view === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const goToNext = () => {
    if (view === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
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
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const sunday = new Date(date);
    sunday.setDate(diff);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const getPreviousMonthDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonthDate);
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(daysInPrevMonth - i);
    }
    return days;
  };

  const getNextMonthDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    const days = [];
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(i);
    }
    return days;
  };

  // Get upcoming events (future only, sorted by date)
  const upcomingEvents = events
    .filter((event) => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  // Format helpers
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handlers
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      category: "training",
      isMandatory: false,
      isAllDay: false,
    });
    setEditingEvent(null);
  };

  const openCreateDialog = (selectedDate?: Date) => {
    resetForm();
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);
      setFormData({
        ...formData,
        startDate: dateStr,
        startTime: timeStr,
        endDate: dateStr,
        endTime: timeStr,
      });
    }
    setShowFormDialog(true);
  };

  const openEditDialog = (event: CalendarEvent) => {
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    setFormData({
      title: event.title,
      description: event.description,
      startDate: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split("T")[0],
      endTime: endDate.toTimeString().slice(0, 5),
      location: event.location,
      category: event.category,
      isMandatory: event.isMandatory,
      isAllDay: event.isAllDay,
    });
    setEditingEvent(event);
    setShowFormDialog(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim() || !formData.startDate || !formData.endDate || !formData.location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = formData.isAllDay
        ? new Date(formData.startDate + "T00:00:00")
        : new Date(formData.startDate + "T" + formData.startTime);

      const endDateTime = formData.isAllDay
        ? new Date(formData.endDate + "T23:59:59")
        : new Date(formData.endDate + "T" + formData.endTime);

      if (editingEvent) {
        await updateEvent(editingEvent.id!, {
          title: formData.title,
          description: formData.description,
          startTime: startDateTime,
          endTime: endDateTime,
          location: formData.location,
          category: formData.category as any,
          isMandatory: formData.isMandatory,
          isAllDay: formData.isAllDay,
        });
        toast.success("Event updated successfully");
      } else {
        await createEvent({
          uuid: `evt-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          startTime: startDateTime,
          endTime: endDateTime,
          location: formData.location,
          category: formData.category as any,
          organizerId: currentUser?.uuid || "",
          attendeeIds: [],
          isMandatory: formData.isMandatory,
          isAllDay: formData.isAllDay,
          reminderBefore: 30,
        });
        toast.success("Event created successfully");
      }
      setShowFormDialog(false);
      resetForm();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (event: CalendarEvent) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(event.id!);
      toast.success("Event deleted successfully");
      setShowEventDialog(false);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  const openEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day);
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setShowDayEventsDialog(true);
    } else {
      openCreateDialog(clickedDate);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const prevMonthDays = getPreviousMonthDays();
  const nextMonthDays = getNextMonthDays();

  return (
    <div className="relative bg-stone-50 min-h-screen">
      {/* Background decorations */}
      <div className="bg-sky-400 w-40 h-40 rounded-full absolute top-1 right-0 opacity-20 z-0 blur-3xl" />
      <div className="bg-emerald-500 w-40 h-24 absolute top-0 left-0 opacity-20 z-0 blur-3xl" />
      <div className="bg-purple-600 w-40 h-24 absolute top-40 left-0 opacity-20 z-0 blur-3xl" />

      <div className="w-full py-12 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
            {/* Upcoming Events Section */}
            <div className="col-span-12 xl:col-span-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-3xl leading-tight text-gray-900 mb-1.5">Upcoming Events</h2>
                  <p className="text-lg font-normal text-gray-600">Don't miss schedule</p>
                </div>
                {canManage && (
                  <Button onClick={() => openCreateDialog()} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-5 flex-col">
                {upcomingEvents.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white text-center text-gray-500">No upcoming events</div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(event.category)}`} />
                          <p className="text-base font-medium text-gray-900">
                            {formatDate(event.startTime)} - {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                        {canManage && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center transition-all duration-500 hover:text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="4" viewBox="0 0 12 4" fill="none">
                                  <path d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(event)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(event)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <h6 className="text-xl leading-8 font-semibold text-black mb-1">{event.title}</h6>
                      <p className="text-base font-normal text-gray-600 line-clamp-2">{event.description}</p>
                      <p className="text-sm font-normal text-gray-500 mt-2">{event.location}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl max-xl:row-start-1">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <h5 className="text-xl leading-8 font-semibold text-gray-900">
                    {view === "day"
                      ? currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : view === "week"
                      ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h5>
                  <div className="flex items-center">
                    <button
                      onClick={goToPrevious}
                      className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center rounded-md p-1 bg-indigo-50 gap-px">
                  <button
                    onClick={() => setView("day")}
                    className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      view === "day" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setView("week")}
                    className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      view === "week" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView("month")}
                    className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      view === "month" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>

              {/* Conditional View Rendering */}
              {view === "month" && (
                <div className="border border-indigo-200 rounded-xl overflow-hidden">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <div
                        key={day}
                        className={`py-3.5 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600 ${
                          i === 0 ? "rounded-tl-xl border-r" : i === 6 ? "rounded-tr-xl" : "border-r"
                        } border-indigo-200`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7">
                    {/* Previous month days */}
                    {prevMonthDays.map((day, i) => (
                      <div
                        key={`prev-${i}`}
                        className={`flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-indigo-200 transition-all duration-300 hover:bg-indigo-50 ${
                          i < 6 ? "border-r" : ""
                        } border-b`}
                      >
                        <span className="text-xs font-semibold text-gray-400">{day}</span>
                      </div>
                    ))}

                    {/* Current month days */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const dayEvents = getEventsForDay(day);
                      const isTodayDate = isToday(day);
                      const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();

                      return (
                        <div
                          key={day}
                          onClick={() => handleDayClick(day)}
                          className={`flex xl:aspect-square max-xl:min-h-[60px] p-3.5 relative bg-white border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer ${
                            dayOfWeek !== 6 ? "border-r" : ""
                          } border-b`}
                        >
                          <span
                            className={`text-xs font-semibold ${
                              isTodayDate
                                ? "text-white w-6 h-6 rounded-full flex items-center justify-center bg-indigo-600"
                                : "text-gray-900"
                            }`}
                          >
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <Badge
                              className={`absolute top-2 right-2 h-6 w-6 flex items-center justify-center p-0 rounded-full text-xs font-semibold ${getCategoryColor(
                                dayEvents[0].category
                              )} text-white`}
                            >
                              {dayEvents.length}
                            </Badge>
                          )}
                        </div>
                      );
                    })}

                    {/* Next month days */}
                    {nextMonthDays.map((day, i) => (
                      <div
                        key={`next-${i}`}
                        className={`flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-indigo-200 transition-all duration-300 hover:bg-indigo-50 ${
                          i === 0 ? "rounded-bl-xl" : ""
                        } ${i === nextMonthDays.length - 1 ? "rounded-br-xl" : ""} ${i < nextMonthDays.length - 1 ? "border-r" : ""}`}
                      >
                        <span className="text-xs font-semibold text-gray-400">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day View */}
              {view === "day" && (
                <div className="border border-indigo-200 rounded-xl overflow-hidden bg-white">
                  <div className="max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const dayEvents = getEventsForDate(currentDate).filter((event) => {
                        const eventHour = new Date(event.startTime).getHours();
                        return eventHour === hour;
                      });

                      return (
                        <div key={hour} className="flex border-b border-indigo-100 min-h-[60px]">
                          <div className="w-20 flex-shrink-0 bg-indigo-50 p-3 border-r border-indigo-200">
                            <span className="text-sm font-medium text-indigo-600">
                              {hour.toString().padStart(2, "0")}:00
                            </span>
                          </div>
                          <div className="flex-1 p-2 relative">
                            {dayEvents.length > 0 ? (
                              <div className="space-y-1">
                                {dayEvents.map((event) => (
                                  <div
                                    key={event.id}
                                    className={`p-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(
                                      event.category
                                    )}`}
                                    onClick={() => openEventDialog(event)}
                                  >
                                    <p className="text-sm font-semibold text-white">{event.title}</p>
                                    <p className="text-xs text-white opacity-90">
                                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Week View */}
              {view === "week" && (
                <div className="border border-indigo-200 rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Week day headers */}
                      <div className="grid grid-cols-8 border-b border-indigo-200">
                        <div className="bg-indigo-50 p-3 border-r border-indigo-200"></div>
                        {getWeekDays(currentDate).map((date, i) => {
                          const isCurrentDay =
                            date.toDateString() === new Date().toDateString();
                          return (
                            <div
                              key={i}
                              className={`bg-indigo-50 p-3 text-center ${
                                i < 6 ? "border-r border-indigo-200" : ""
                              }`}
                            >
                              <div
                                className={`text-sm font-medium ${
                                  isCurrentDay ? "text-indigo-600" : "text-gray-700"
                                }`}
                              >
                                {date.toLocaleDateString("en-US", { weekday: "short" })}
                              </div>
                              <div
                                className={`text-xs mt-1 ${
                                  isCurrentDay
                                    ? "w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto"
                                    : "text-gray-500"
                                }`}
                              >
                                {date.getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Time grid */}
                      <div className="max-h-[500px] overflow-y-auto">
                        {Array.from({ length: 24 }, (_, hour) => (
                          <div key={hour} className="grid grid-cols-8 border-b border-indigo-100 min-h-[50px]">
                            <div className="bg-indigo-50 p-2 border-r border-indigo-200">
                              <span className="text-xs font-medium text-indigo-600">
                                {hour.toString().padStart(2, "0")}:00
                              </span>
                            </div>
                            {getWeekDays(currentDate).map((date, dayIndex) => {
                              const dayEvents = getEventsForDate(date).filter((event) => {
                                const eventHour = new Date(event.startTime).getHours();
                                return eventHour === hour;
                              });

                              return (
                                <div
                                  key={dayIndex}
                                  className={`p-1 relative ${
                                    dayIndex < 6 ? "border-r border-indigo-100" : ""
                                  }`}
                                >
                                  {dayEvents.length > 0 ? (
                                    <div className="space-y-1">
                                      {dayEvents.map((event) => (
                                        <div
                                          key={event.id}
                                          className={`px-1.5 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(
                                            event.category
                                          )}`}
                                          onClick={() => openEventDialog(event)}
                                          title={event.title}
                                        >
                                          <p className="text-white font-medium truncate text-[10px]">
                                            {event.title}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getCategoryColor(selectedEvent.category)}>{selectedEvent.category}</Badge>
                {selectedEvent.isMandatory && <Badge variant="destructive">Mandatory</Badge>}
                {selectedEvent.isAllDay && <Badge variant="secondary">All Day</Badge>}
              </div>
              <p className="text-sm">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Start</p>
                  <p className="text-muted-foreground">
                    {formatDate(selectedEvent.startTime)}
                    {!selectedEvent.isAllDay && ` • ${formatTime(selectedEvent.startTime)}`}
                  </p>
                </div>
                <div>
                  <p className="font-medium">End</p>
                  <p className="text-muted-foreground">
                    {formatDate(selectedEvent.endTime)}
                    {!selectedEvent.isAllDay && ` • ${formatTime(selectedEvent.endTime)}`}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{selectedEvent.location}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Event title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Event location" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.isAllDay}
                onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="allDay" className="cursor-pointer">
                All Day Event
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="mandatory"
                checked={formData.isMandatory}
                onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="mandatory" className="cursor-pointer">
                Mandatory Attendance
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFormDialog(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingEvent ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{editingEvent ? "Update" : "Create"} Event</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Events List Dialog */}
      <Dialog open={showDayEventsDialog} onOpenChange={setShowDayEventsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Events on {selectedDayEvents[0] && formatDate(selectedDayEvents[0].startTime)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setShowDayEventsDialog(false);
                  openEventDialog(event);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(event.category)}`} />
                      <h3 className="font-semibold text-base">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>
                        {event.isAllDay ? "All Day" : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                      </span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    {event.isMandatory && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDayEventsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
