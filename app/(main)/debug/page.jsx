import { testDatabaseConnection } from "@/actions/test-db";
import { getCurrentUser } from "@/actions/onboarding";
import { getPatientAppointments } from "@/actions/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DebugPage() {
  const dbTest = await testDatabaseConnection();
  const user = await getCurrentUser();
  
  let appointmentsTest = null;
  if (user && user.role === "PATIENT") {
    appointmentsTest = await getPatientAppointments();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-6">
        {/* Database Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded ${dbTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p><strong>Status:</strong> {dbTest.success ? '✅ Connected' : '❌ Failed'}</p>
              <p><strong>Message:</strong> {dbTest.message}</p>
              {dbTest.success && (
                <>
                  <p><strong>User Count:</strong> {dbTest.userCount}</p>
                  <p><strong>Appointment Count:</strong> {dbTest.appointmentCount}</p>
                </>
              )}
              {!dbTest.success && (
                <p><strong>Error:</strong> {dbTest.error}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-100 text-blue-800 rounded">
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not authenticated'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Test */}
        {user && user.role === "PATIENT" && (
          <Card>
            <CardHeader>
              <CardTitle>Appointments Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                <p><strong>Result:</strong> {JSON.stringify(appointmentsTest, null, 2)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Variables Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-100 text-gray-800 rounded">
              <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>CLERK_SECRET_KEY:</strong> {process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 