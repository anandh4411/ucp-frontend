// src/features/dashboard/data/templates.ts
import { Template, InstitutionProgress, PhaseCard } from "./schema";

export const templates: Template[] = [
  {
    id: "template-1",
    name: "Classic School ID",
    description:
      "Traditional school ID card with student photo, name, class, and school logo",
    imageUrl: "/templates/school-classic.jpg",
    category: "school",
    features: [
      "Student Photo",
      "Name & Class",
      "School Logo",
      "Student ID Number",
    ],
    isPopular: true,
  },
  {
    id: "template-2",
    name: "Modern School Badge",
    description:
      "Contemporary design with rounded corners and colorful accents",
    imageUrl: "/templates/school-modern.jpg",
    category: "school",
    features: [
      "Student Photo",
      "QR Code",
      "Emergency Contact",
      "School Colors",
    ],
    isPopular: false,
  },
  {
    id: "template-3",
    name: "Corporate Employee ID",
    description: "Professional employee ID with department and access level",
    imageUrl: "/templates/corporate-standard.jpg",
    category: "office",
    features: ["Employee Photo", "Department", "Access Level", "Employee ID"],
    isPopular: true,
  },
  {
    id: "template-4",
    name: "Medical Staff Badge",
    description: "Healthcare professional ID with role and certification info",
    imageUrl: "/templates/medical-professional.jpg",
    category: "medical",
    features: [
      "Staff Photo",
      "Role & Department",
      "Certification",
      "Emergency Code",
    ],
    isPopular: false,
  },
  {
    id: "template-5",
    name: "Generic Organization ID",
    description: "Flexible template suitable for any organization type",
    imageUrl: "/templates/generic-org.jpg",
    category: "generic",
    features: [
      "Member Photo",
      "Organization Logo",
      "Member ID",
      "Validity Period",
    ],
    isPopular: false,
  },
];

// Mock data for current institution progress
export const institutionProgress: InstitutionProgress = {
  institutionId: "1",
  institutionName: "Springfield Elementary School",
  selectedTemplateId: "template-1",
  selectedTemplate: templates[0],
  totalPhases: 4,
  completedPhases: 1,
  inProgressPhases: 2,
  pendingPhases: 1,
  totalSubmissions: 150,
  completedSubmissions: 95,
  pendingSubmissions: 55,
  completionPercentage: 63,
  lastActivity: "2024-01-28T14:30:00Z",
};

// Mock phases data with production workflow statuses
export const phases: PhaseCard[] = [
  {
    id: "phase-1",
    name: "Grade 5A Students",
    description: "First batch of 50 students from Grade 5A",
    status: "delivered",
    submissionCount: 50,
    targetCount: 50,
    startedAt: "2024-01-15T09:00:00Z",
    completedAt: "2024-01-25T17:00:00Z",
    createdAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "phase-2",
    name: "Grades 3B & 4A Combined",
    description: "Combined batch from two classes",
    status: "printing-ongoing",
    submissionCount: 60,
    targetCount: 60,
    startedAt: "2024-01-22T08:00:00Z",
    createdAt: "2024-01-20T15:00:00Z",
  },
  {
    id: "phase-3",
    name: "Grade 6 Students",
    description: "Third batch for Grade 6",
    status: "design-completed",
    submissionCount: 30,
    targetCount: 30,
    startedAt: "2024-01-26T10:00:00Z",
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "phase-4",
    name: "Remaining Classes & Staff",
    description: "All other classes and staff members",
    status: "file-processing",
    submissionCount: 10,
    targetCount: 40,
    createdAt: "2024-01-28T09:00:00Z",
  },
];
