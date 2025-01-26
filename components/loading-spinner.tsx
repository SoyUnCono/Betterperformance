import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin" />;
    </div>
  );
}
