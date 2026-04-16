import AdminShell from "./AdminShell";

import { requireAdmin } from "@/app/lib/adminSession";

export const metadata = {
  title: "Admin | Portfolio",
};

export default async function AdminProtectedLayout({ children }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
