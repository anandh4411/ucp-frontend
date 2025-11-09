export const templateFilters = [
  {
    id: "status",
    title: "Status",
    options: [
      {
        label: "Draft",
        value: "draft",
        icon: "circle",
      },
      {
        label: "Published",
        value: "published",
        icon: "check-circle",
      },
      {
        label: "Archived",
        value: "archived",
        icon: "archive",
      },
    ],
  },
  {
    id: "category",
    title: "Category",
    options: [
      {
        label: "Student ID",
        value: "student",
        icon: "users",
      },
      {
        label: "Employee ID",
        value: "employee",
        icon: "users",
      },
      {
        label: "Visitor Pass",
        value: "visitor",
        icon: "users",
      },
      {
        label: "Member Card",
        value: "member",
        icon: "users",
      },
      {
        label: "Contractor ID",
        value: "contractor",
        icon: "users",
      },
      {
        label: "Other",
        value: "other",
        icon: "image",
      },
    ],
  },
] as const;
