import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold  md:text-4xl ">{title}</h1>
        {description && <p className="mt-2 ">{description}</p>}
      </div>

      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
