import Label from "./Label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className="text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}