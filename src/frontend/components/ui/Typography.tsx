type HeadingProps = {
  children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) {
  return (
    <h2 className="text-heading-lg text-slate-900">
      {children}
    </h2>
  );
}

export function Text({ children }: HeadingProps) {
  return (
    <p className="text-body text-slate-600">
      {children}
    </p>
  );
}