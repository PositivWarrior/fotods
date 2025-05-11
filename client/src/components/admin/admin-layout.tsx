import { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Helmet } from "react-helmet";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>{title} | FotoDS Admin</title>
      </Helmet>
      
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="border-b p-4 bg-white">
          <h1 className="text-2xl font-poppins font-semibold">{title}</h1>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
