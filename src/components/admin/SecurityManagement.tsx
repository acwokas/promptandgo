import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SecurityManagement() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    success: boolean;
    message: string;
    results?: any;
  } | null>(null);
  const { toast } = useToast();

  const runDataEncryption = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);

    try {
      console.log('Starting security data migration...');
      
      const { data, error } = await supabase.functions.invoke('security-data-migration', {
        body: {
          action: 'both' // Encrypt both contacts and subscribers
        }
      });

      if (error) {
        console.error('Migration failed:', error);
        throw new Error(error.message || 'Migration failed');
      }

      console.log('Migration completed:', data);
      setMigrationStatus(data);
      
      if (data.success) {
        toast({
          title: "Security Migration Successful",
          description: "Customer data has been encrypted successfully.",
        });
      } else {
        toast({
          title: "Migration Warning",
          description: data.error || "Migration completed with warnings.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Migration error:', error);
      const errorMessage = error.message || 'Failed to run security migration';
      
      setMigrationStatus({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: "Migration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Security Management</h2>
      </div>

      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Critical Security Action Required:</strong> Customer data encryption migration must be run to protect sensitive information.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Data Encryption Migration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Encryption Migration
            </CardTitle>
            <CardDescription>
              Encrypt existing plaintext customer emails, names, and messages to secure sensitive data.
              This addresses the critical security vulnerability identified in the security review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">What this migration does:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Encrypts all plaintext customer emails in the subscribers table</li>
                <li>• Encrypts all plaintext names, emails, and messages in the contacts table</li>
                <li>• Creates secure hash indices for search functionality</li>
                <li>• Logs all encryption actions for audit purposes</li>
                <li>• Replaces plaintext data with encrypted versions</li>
              </ul>
            </div>

            <Button 
              onClick={runDataEncryption}
              disabled={isMigrating}
              className="w-full"
            >
              {isMigrating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Encrypting Data...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Run Data Encryption Migration
                </>
              )}
            </Button>

            {migrationStatus && (
              <Alert className={migrationStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {migrationStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={migrationStatus.success ? "text-green-800" : "text-red-800"}>
                  <strong>{migrationStatus.success ? 'Success:' : 'Error:'}</strong> {migrationStatus.message}
                  {migrationStatus.results && (
                    <div className="mt-2 text-xs">
                      <pre className="bg-black/10 p-2 rounded">
                        {JSON.stringify(migrationStatus.results, null, 2)}
                      </pre>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Manual Security Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Security Configuration</CardTitle>
            <CardDescription>
              The following security improvements require manual configuration in your Supabase dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-orange-700">⚠️ Enable Leaked Password Protection</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to Authentication → Settings → Password Protection and enable leaked password detection.
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/mncxspmtqvqgvtrxbxzb/auth/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open Auth Settings
                  </a>
                </Button>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-orange-700">⚠️ Upgrade PostgreSQL Version</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Postgres database has security patches available. Upgrade to the latest version.
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/mncxspmtqvqgvtrxbxzb/settings/general" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open Database Settings
                  </a>
                </Button>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-green-700">✅ Security Monitoring Enabled</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Enhanced security monitoring, audit logging, and admin rate limiting are now active.
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-green-700">✅ RLS Policies Strengthened</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Row-level security policies have been tightened to restrict unauthorised data access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}