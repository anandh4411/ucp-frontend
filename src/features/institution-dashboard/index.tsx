// src/features/institution-dashboard/index.tsx
import { useState, useEffect } from "react";
import { TemplateSelection } from "./components/template-selection";
import { ProgressDashboard } from "./components/progress-dashboard";
import { templates, institutionProgress, phases } from "./data/templates";
import { Template, InstitutionProgress, PhaseCard } from "./data/schema";

export default function Dashboard() {
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionProgress | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [institutionPhases, setInstitutionPhases] = useState<PhaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInstitutionData = async () => {
      setIsLoading(true);

      // TODO: Replace with API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const hasSelectedTemplate = institutionProgress.selectedTemplateId !== null;

      if (hasSelectedTemplate) {
        setCurrentInstitution(institutionProgress);
        setInstitutionPhases(phases);
      } else {
        setCurrentInstitution(institutionProgress);
        setAvailableTemplates(templates);
      }

      setIsLoading(false);
    };

    loadInstitutionData();
  }, []);

  const handleTemplateSelect = async (selectedTemplate: Template) => {
    // TODO: API call
    console.log("Template selected:", selectedTemplate);

    const updatedInstitution: InstitutionProgress = {
      ...institutionProgress,
      selectedTemplateId: selectedTemplate.id,
      selectedTemplate: selectedTemplate,
    };

    setCurrentInstitution(updatedInstitution);
    setInstitutionPhases(phases);
    setAvailableTemplates([]);
  };

  const handleCreatePhase = () => {
    // TODO: Navigate to phases page
    console.log("Navigate to create phase");
  };

  const handleViewSubmissions = () => {
    // TODO: Navigate to submissions page
    console.log("Navigate to submissions");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentInstitution) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg">⚠️ Error</div>
          <p className="text-muted-foreground">
            Unable to load institution data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show template selection if no template selected
  if (!currentInstitution.selectedTemplate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TemplateSelection
          templates={availableTemplates}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    );
  }

  // Show progress dashboard if template already selected
  return (
    <div className="container mx-auto px-4 py-6">
      <ProgressDashboard
        progress={currentInstitution}
        phases={institutionPhases}
        onCreatePhase={handleCreatePhase}
        onViewSubmissions={handleViewSubmissions}
      />
    </div>
  );
}
