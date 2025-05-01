import { getVisitorCount } from "@/actions/visitor-actions";
import { FlipCounter } from "./flip-counter";

export async function ServerFlipCounter() {
  const { count, error } = await getVisitorCount();

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400">
        <span>Tidak dapat memuat jumlah pengunjung</span>
      </div>
    );
  }

  // Make sure we have at least 1 visitor count to display
  const visitorCount = count || 1;

  return <FlipCounter count={visitorCount} />;
}
