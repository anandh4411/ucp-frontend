// src/features/institutions/components/institution-view-modal.tsx
import {
  Eye,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Key,
  Copy,
  RotateCcw,
  Ban,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstitutionData } from "@/types/dto/institution.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: InstitutionData | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  return status === "active" ? "default" : "secondary";
};

const getTypeLabel = (type: string) => {
  const typeLabels = {
    school: "School",
    office: "Office",
    organization: "Organization",
    other: "Other",
  } as const;
  return typeLabels[type as keyof typeof typeLabels] || type;
};

export function InstitutionViewModal({
  open,
  onOpenChange,
  institution,
}: Props) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!institution) return null;

  const generateAccessToken = () => {
    // Generate institution-specific access token
    const prefix = (institution.name || "XXX")
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "X");
    const randomPart = crypto
      .getRandomValues(new Uint32Array(4))
      .reduce((acc, val) => acc + val.toString(36), "")
      .toUpperCase()
      .substring(0, 16);
    return `${prefix}_ACCESS_2025_${randomPart}`;
  };

  const generateInstitutionLoginLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/institution/login`;
  };

  const handleGenerateLogin = async () => {
    try {
      const newToken = generateAccessToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90); // 90 days expiry

      // TODO: Call API to update institution with new access token
      console.log("Generated new access token:", {
        institutionId: institution.id,
        accessToken: newToken,
        expiresAt: expiresAt.toISOString(),
      });

      // In real app: await api.generateInstitutionAccessToken(institution.id, { token: newToken, expiresAt })
      setCopySuccess("Access token generated successfully!");
      setTimeout(() => setCopySuccess(null), 3000);
    } catch (error) {
      console.error("Failed to generate access token:", error);
    }
  };

  const handleCopyLink = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied to clipboard!`);
      setTimeout(() => setCopySuccess(null), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopySuccess("Failed to copy to clipboard");
      setTimeout(() => setCopySuccess(null), 3000);
    }
  };

  const handleRevokeLogin = async () => {
    try {
      // TODO: Call API to revoke access token
      console.log("Revoked access token for institution:", institution.id);
      // In real app: await api.revokeInstitutionAccessToken(institution.id)
      setCopySuccess("Access token revoked successfully!");
      setTimeout(() => setCopySuccess(null), 3000);
    } catch (error) {
      console.error("Failed to revoke access token:", error);
    }
  };

  const isAccessExpired = () => {
    if (!institution.accessTokenExpiresAt) return false;
    return new Date() > new Date(institution.accessTokenExpiresAt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Institution Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{institution.name || "N/A"}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    {getTypeLabel(institution.type || "")}
                  </Badge>
                  <Badge
                    variant={institution.isAccessActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {institution.isAccessActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Address */}
            {institution.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.address}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Institution Access Management */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Key className="h-4 w-4" />
              Institution Access Management
            </h4>

            {/* Success/Error Messages */}
            {copySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-md text-sm">
                {copySuccess}
              </div>
            )}

            {/* Access Token Status */}
            <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
              {institution.accessToken ? (
                <>
                  {/* Access Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Access Status:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          institution.isAccessActive && !isAccessExpired()
                            ? "default"
                            : "destructive"
                        }
                      >
                        {institution.isAccessActive && !isAccessExpired()
                          ? "Active"
                          : isAccessExpired()
                          ? "Expired"
                          : "Inactive"}
                      </Badge>
                      {institution.activeSessions &&
                        institution.activeSessions > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {institution.activeSessions} active sessions
                          </Badge>
                        )}
                    </div>
                  </div>

                  {/* Institution Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Institution Code:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={institution.institutionCode}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopyLink(
                            institution.institutionCode || "",
                            "Institution Code"
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Access Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Token:</label>
                    <div className="flex gap-2">
                      <Input
                        value={institution.accessToken}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopyLink(
                            institution.accessToken!,
                            "Access token"
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Login Page Link */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Institution Login Page:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={generateInstitutionLoginLink()}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopyLink(
                            generateInstitutionLoginLink(),
                            "Login page link"
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(generateInstitutionLoginLink(), "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Copy Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="text-sm text-blue-900 font-medium mb-2">
                      Share with Institution:
                    </div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>1. Login Page: {generateInstitutionLoginLink()}</div>
                      <div>2. Institution Code: {institution.institutionCode}</div>
                      <div>3. Access Token: {institution.accessToken}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                      onClick={() => {
                        const fullInstructions = `Institution Login Details:
                        Login Page: ${generateInstitutionLoginLink()}
                        Institution Code: ${institution.institutionCode}
                        Access Token: ${institution.accessToken}

                        Instructions: Visit the login page, enter your Institution Code and Access Token to access your dashboard.`;
                        handleCopyLink(
                          fullInstructions,
                          "Complete login instructions"
                        );
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy All Details
                    </Button>
                  </div>

                  {/* Token Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <div className="font-medium">
                        {institution.accessTokenCreatedAt &&
                          formatDate(institution.accessTokenCreatedAt)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <div className="font-medium">
                        {institution.accessTokenExpiresAt &&
                          formatDate(institution.accessTokenExpiresAt)}
                        {isAccessExpired() && (
                          <span className="text-destructive ml-1">
                            (Expired)
                          </span>
                        )}
                      </div>
                    </div>
                    {institution.lastLoginAt && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">
                          Last login:
                        </span>
                        <div className="font-medium">
                          {formatDate(institution.lastLoginAt)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateLogin}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Regenerate Token
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRevokeLogin}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Revoke Access
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* No Access Token Generated */}
                  <div className="text-center py-4">
                    <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No access token generated for this institution
                    </p>
                    <Button onClick={handleGenerateLogin}>
                      Generate Access Token
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact Information</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactPerson}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {institution.contactEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          {/* TODO: Add createdAt and updatedAt fields to backend DTO */}
          {/* <div className="space-y-3">
            <h4 className="text-sm font-semibold">System Information</h4>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {formatDate(institution.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {formatDate(institution.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
