import {
  Type,
  Mail,
  Phone,
  ChevronDown,
  Calendar,
  Upload,
  AlignLeft,
  Hash,
} from "lucide-react";
import { FieldType } from "./schema";

export const fieldTypes: FieldType[] = [
  {
    id: "text",
    label: "Text Input",
    icon: Type,
    description: "Single line text input for names, titles, etc.",
    defaultProps: {
      type: "text",
      label: "Text Field",
      placeholder: "Enter text",
      required: false,
    },
  },
  {
    id: "email",
    label: "Email Input",
    icon: Mail,
    description: "Email input with validation",
    defaultProps: {
      type: "email",
      label: "Email Address",
      placeholder: "Enter email",
      required: false,
    },
  },
  {
    id: "phone",
    label: "Phone Number",
    icon: Phone,
    description: "Phone number input field",
    defaultProps: {
      type: "phone",
      label: "Phone Number",
      placeholder: "Enter phone number",
      required: false,
    },
  },
  {
    id: "select",
    label: "Dropdown",
    icon: ChevronDown,
    description: "Dropdown selection with multiple options",
    defaultProps: {
      type: "select",
      label: "Select Option",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
    },
  },
  {
    id: "date",
    label: "Date Picker",
    icon: Calendar,
    description: "Date selection input",
    defaultProps: {
      type: "date",
      label: "Date",
      required: false,
    },
  },
  {
    id: "file",
    label: "File Upload",
    icon: Upload,
    description: "File upload for documents or images",
    defaultProps: {
      type: "file",
      label: "Upload File",
      required: false,
      helpText: "Choose a file to upload",
    },
  },
  {
    id: "textarea",
    label: "Text Area",
    icon: AlignLeft,
    description: "Multi-line text input for longer content",
    defaultProps: {
      type: "textarea",
      label: "Text Area",
      placeholder: "Enter details",
      required: false,
    },
  },
  {
    id: "number",
    label: "Number Input",
    icon: Hash,
    description: "Numeric input field",
    defaultProps: {
      type: "number",
      label: "Number",
      placeholder: "Enter number",
      required: false,
    },
  },
];
