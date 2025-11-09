// src/features/submissions/components/submission-import-dialog.tsx
import { useState, useRef } from "react";
import { FileText, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/select-dropdown";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock institutions - in real app, fetch from API
const institutions = [
  { label: "Springfield Elementary School", value: "1" },
  { label: "TechCorp Solutions", value: "2" },
  { label: "Community Health Center", value: "3" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CSVData {
  [key: string]: string;
}

export function SubmissionImportDialog({ open, onOpenChange }: Props) {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please select a valid CSV file.");
      return;
    }

    setCsvFile(file);
    setError("");
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          setError(
            "CSV file must contain at least a header row and one data row."
          );
          setIsLoading(false);
          return;
        }

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        // Check for required columns
        const hasName = headers.some((h) => h.toLowerCase().includes("name"));
        const hasId = headers.some(
          (h) =>
            h.toLowerCase().includes("id") || h.toLowerCase().includes("number")
        );

        if (!hasName || !hasId) {
          setError("CSV must contain both Name and ID Number columns.");
          setIsLoading(false);
          return;
        }

        const data: CSVData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(",")
            .map((v) => v.trim().replace(/"/g, ""));
          const row: CSVData = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });

          // Basic validation - ensure name and ID are not empty
          const nameField = headers.find((h) =>
            h.toLowerCase().includes("name")
          );
          const idField = headers.find(
            (h) =>
              h.toLowerCase().includes("id") ||
              h.toLowerCase().includes("number")
          );

          if (nameField && idField && row[nameField] && row[idField]) {
            data.push(row);
          }
        }

        if (data.length === 0) {
          setError(
            "No valid records found. Ensure Name and ID Number fields are not empty."
          );
          setIsLoading(false);
          return;
        }

        setCsvData(data);
        setError("");
      } catch (err) {
        setError("Error parsing CSV file. Please check the format.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!selectedInstitution) {
      setError("Please select an institution.");
      return;
    }

    if (csvData.length === 0) {
      setError("Please upload a valid CSV file.");
      return;
    }

    // Generate verification codes for each person
    const importData = csvData.map((row) => ({
      ...row,
      institutionId: selectedInstitution,
      verificationCode: Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }));

    console.log("Importing CSV data:", importData);

    // Reset form
    handleClose();
  };

  const handleClose = () => {
    setSelectedInstitution("");
    setCsvFile(null);
    setCsvData([]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import People from CSV
          </DialogTitle>
          <DialogDescription>
            Select an institution and upload a CSV file to import people and
            generate login codes automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Institution Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Select Institution</Label>
              <SelectDropdown
                defaultValue={selectedInstitution}
                onValueChange={setSelectedInstitution}
                placeholder="Choose institution"
                items={institutions}
              />
            </div>

            {/* Requirements Info */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">CSV Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First row must contain headers</li>
                <li>
                  • <strong>Required:</strong> Name column
                </li>
                <li>
                  • <strong>Required:</strong> ID Number column
                </li>
                <li>• Login codes generated automatically</li>
              </ul>
            </div>
          </div>

          {/* Right Column - File Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Upload CSV File</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6">
                <div className="text-center space-y-3">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Choose CSV File"}
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {csvFile ? (
                      <span className="font-medium">{csvFile.name}</span>
                    ) : (
                      "Select a CSV file to upload"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* File Status */}
            {csvData.length > 0 && !error && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{csvData.length} records</strong> ready to import with
                  auto-generated login codes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Error Alert - Full Width */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleImport}
            disabled={!selectedInstitution || csvData.length === 0 || isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Import ${csvData.length || 0} People`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
