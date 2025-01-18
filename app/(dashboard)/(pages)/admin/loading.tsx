import { AdminTableSkeleton } from "@/app/(dashboard)/_components/AdminTableSkeleton";

export default function Loading() {
  return (
    <div className="container py-6">
      <AdminTableSkeleton />
    </div>
  );
}
