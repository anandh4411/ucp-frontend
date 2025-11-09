// src/features/dashboard/components/template-selection.tsx
import { useState } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Template } from "../data/schema";

interface Props {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export function TemplateSelection({ templates, onTemplateSelect }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  // const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Impressaa!
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose an ID card template to get started with your institution
        </p>
        <p className="text-sm text-muted-foreground">
          ⚠️ Once selected, this template cannot be changed
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? "ring-2 ring-primary shadow-md"
                : ""
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.name}
                    {template.isPopular && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">
                    {template.category}
                  </Badge>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="aspect-[3/2] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🆔</div>
                  <div className="text-xs">Template Preview</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Includes:
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Section */}
      {selectedTemplate && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              You have selected <strong>{selectedTemplate.name}</strong>. This
              template will be permanently linked to your institution.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleConfirmSelection}
              className="flex items-center gap-2"
            >
              Confirm & Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
