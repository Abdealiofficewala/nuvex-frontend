import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";

type AdminTableCheckboxProps = {
  checked: boolean;
  label: string;
  className?: string;
};

export function AdminTableCheckbox({ checked, label, className }: AdminTableCheckboxProps) {
  return <AdminCheckbox checked={checked} label={label} readOnly className={className} />;
}
