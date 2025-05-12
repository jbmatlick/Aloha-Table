import dynamic from "next/dynamic";
const AdminClient = dynamic(() => import("./AdminClient").then(mod => mod.default), { ssr: false });

export default function AdminPage() {
  return <AdminClient />;
}