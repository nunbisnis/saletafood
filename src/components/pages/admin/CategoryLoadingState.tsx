"use client";

export function CategoryLoadingState() {
  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 mb-6 flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Memuat kategori...</p>
      </div>
    </div>
  );
}
