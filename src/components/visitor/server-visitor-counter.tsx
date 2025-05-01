import { getVisitorCount } from "@/actions/visitor-actions";
import { Users } from "lucide-react";

export async function ServerVisitorCounter() {
  const { count, error } = await getVisitorCount();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
      <Users size={16} className="text-orange-500" />
      <span>
        {error ? (
          "Tidak dapat memuat jumlah pengunjung"
        ) : (
          <>
            Total Pengunjung:{" "}
            <span className="font-semibold">
              {count?.toLocaleString() || 0}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
