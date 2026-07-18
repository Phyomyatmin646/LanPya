import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F6F8FA]">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto w-full relative z-10">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
