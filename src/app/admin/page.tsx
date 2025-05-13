import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdminClient = dynamic(() => import("./AdminClient").then(mod => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    </div>
  )
});

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    }>
      <AdminClient />
    </Suspense>
  );
}