import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin | Portfolio",
};

export default function AdminProtectedLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
