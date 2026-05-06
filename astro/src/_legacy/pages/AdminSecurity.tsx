import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Link } from "react-router-dom";
import SecurityMonitoringDashboard from '@/components/admin/SecurityMonitoringDashboard';

const AdminSecurity = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  // Allowlisted email as a temporary safety net while we debug admin role checks
  const emailAllow = ["me@adrianwatkins.com"];
  const effectiveIsAdmin = isAdmin || (user?.email ? emailAllow.includes(user.email) : false);

  if (!effectiveIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Security Monitoring - Admin"
        description="Security monitoring dashboard for administrators"
      />
      
      <PageHero
        title="Security Monitoring"
        subtitle="Monitor admin activity and security events"
        variant="admin"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Admin Tools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Security Monitoring</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-7xl mx-auto">
          <SecurityMonitoringDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;