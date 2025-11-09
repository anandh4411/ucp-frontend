// src/features/forms/components/form-builder-dialog.tsx
import { useState } from "react";
import { Settings, Plus, Trash2, Edit3, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/types/dto/form.dto";
import { FormField } from "../data/schema";
import { fieldTypes } from "../data/field-types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormData | null;
}

export function FormBuilderDialog({ open, onOpenChange, form }: Props) {
  const [fields, setFields] = useState<FormField[]>(form?.fields || []);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [optionInput, setOptionInput] = useState("");

  if (!form) return null;

  const addField = (fieldTypeId: string) => {
    const fieldType = fieldTypes.find((ft) => ft.id === fieldTypeId);
    if (!fieldType) return;

    const newField: FormField = {
      ...fieldType.defaultProps,
      id: `field_${Date.now()}`,
      type: fieldType.defaultProps.type!,
      label: fieldType.defaultProps.label!,
      order: fields.length + 1,
    } as FormField;

    setFields([...fields, newField]);
    setSelectedField(newField); // Auto-select new field for editing
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );

    // Update selected field if it's the one being edited
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const addOption = (fieldId: string, option: string) => {
    if (!option.trim()) return;

    const field = fields.find((f) => f.id === fieldId);
    const currentOptions = field?.options || [];

    if (!currentOptions.includes(option.trim())) {
      updateField(fieldId, {
        options: [...currentOptions, option.trim()],
      });
    }
    setOptionInput("");
  };

  const removeOption = (fieldId: string, optionToRemove: string) => {
    const field = fields.find((f) => f.id === fieldId);
    const currentOptions = field?.options || [];

    updateField(fieldId, {
      options: currentOptions.filter((opt) => opt !== optionToRemove),
    });
  };

  const handleOptionKeyPress = (e: React.KeyboardEvent, fieldId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOption(fieldId, optionInput);
    }
  };

  const handleSave = () => {
    console.log("Saving form fields:", fields);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Form Builder - {form.name}
          </DialogTitle>
          <DialogDescription>
            Build your form by adding fields and configuring their properties
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Panel - Form Fields */}
          <div className="col-span-2 space-y-4">
            {/* Quick Add Toolbar */}
            <div className="border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium mr-2">Add Field:</span>
                {fieldTypes.map((fieldType) => (
                  <Button
                    key={fieldType.id}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => addField(fieldType.id)}
                  >
                    <fieldType.icon className="h-3 w-3 mr-1" />
                    {fieldType.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Form Fields List */}
            <div className="space-y-3 overflow-y-auto max-h-[400px]">
              <div className="flex items-center justify-between pr-3">
                <h3 className="font-medium">Form Fields</h3>
                <Badge variant="outline" className="text-xs">
                  {fields.length} fields
                </Badge>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Plus className="mx-auto h-6 w-6 mb-2" />
                  <p className="text-sm">No fields added yet</p>
                  <p className="text-xs">Use the toolbar above to add fields</p>
                </div>
              ) : (
                <div className="space-y-2 pb-12 pr-3">
                  {fields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <div
                        key={field.id}
                        className={`
                          group flex items-center justify-between p-3 border rounded-lg transition-all cursor-pointer
                          ${
                            selectedField?.id === field.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/30"
                          }
                        `}
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded bg-muted text-xs font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{field.label}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{field.type}</span>
                              {field.required && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1 py-0"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Field Properties */}
          <div className="space-y-4 overflow-y-auto max-h-[500px] pb-10">
            <div className="flex justify-between">
              <h3 className="font-medium">Field Properties</h3>
              <Button onClick={handleSave} size="sm">
                Save Form
              </Button>
            </div>

            {selectedField ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Edit: {selectedField.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Label */}
                  <div className="space-y-2">
                    <Label className="text-xs">Field Label</Label>
                    <Input
                      value={selectedField.label}
                      onChange={(e) =>
                        updateField(selectedField.id, { label: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Placeholder */}
                  {["text", "email", "phone", "number", "textarea"].includes(
                    selectedField.type
                  ) && (
                    <div className="space-y-2">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={selectedField.placeholder || ""}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            placeholder: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  )}

                  {/* Help Text */}
                  <div className="space-y-2">
                    <Label className="text-xs">Help Text</Label>
                    <Textarea
                      value={selectedField.helpText || ""}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          helpText: e.target.value,
                        })
                      }
                      className="text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Required Field</Label>
                    <Switch
                      checked={selectedField.required}
                      onCheckedChange={(checked) =>
                        updateField(selectedField.id, { required: checked })
                      }
                    />
                  </div>

                  {/* Options for Select Fields */}
                  {selectedField.type === "select" && (
                    <div className="space-y-2">
                      <Label className="text-xs">Options</Label>

                      {/* Add Option Input */}
                      <div className="flex gap-2">
                        <Input
                          value={optionInput}
                          onChange={(e) => setOptionInput(e.target.value)}
                          onKeyPress={(e) =>
                            handleOptionKeyPress(e, selectedField.id)
                          }
                          placeholder="Add option and press Enter"
                          className="h-8 text-sm flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 px-3"
                          onClick={() =>
                            addOption(selectedField.id, optionInput)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Options Chips */}
                      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-lg bg-muted/30">
                        {selectedField.options &&
                        selectedField.options.length > 0 ? (
                          selectedField.options.map((option, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 px-2 py-1 text-xs"
                            >
                              {option}
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(selectedField.id, option)
                                }
                                className="ml-1 hover:text-destructive transition-colors cursor-pointer"
                              >
                                <CircleX className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No options added yet
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Validation Rules */}
                  {["text", "textarea"].includes(selectedField.type) && (
                    <div className="space-y-3">
                      <Label className="text-xs">Validation</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Min Length
                          </Label>
                          <Input
                            type="number"
                            value={selectedField.validation?.minLength || ""}
                            onChange={(e) =>
                              updateField(selectedField.id, {
                                validation: {
                                  ...selectedField.validation,
                                  minLength: e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                },
                              })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Max Length
                          </Label>
                          <Input
                            type="number"
                            value={selectedField.validation?.maxLength || ""}
                            onChange={(e) =>
                              updateField(selectedField.id, {
                                validation: {
                                  ...selectedField.validation,
                                  maxLength: e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                },
                              })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Edit3 className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">
                    Select a field to edit its properties
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator />
      </DialogContent>
    </Dialog>
  );
}
