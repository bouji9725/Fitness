import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

// Shared page container that normalizes width and spacing.
// Use this for every route so pages stay visually consistent.
export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}