import Navbar from '@/components/Navbar';
import { SidebarDemo } from '@/components/SideBar';
import { Sidebar } from 'lucide-react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      {/* <Navbar /> */}
      <div className="flex flex-1">
        <SidebarDemo />
        {/* <main className="flex-1">
          {children}
        </main> */}
      </div>

    </div>
  );
}