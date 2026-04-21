import { Outlet } from 'react-router';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#800020] via-[#6b0019] to-[#4a0012] overflow-hidden relative">
      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 100px,
              rgba(212, 175, 55, 0.15) 100px,
              rgba(212, 175, 55, 0.15) 101px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 100px,
              rgba(212, 175, 55, 0.15) 100px,
              rgba(212, 175, 55, 0.15) 101px
            )
          `
        }}></div>
      </div>
      
      {/* Golden circular decorative elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full border-2 border-[#D4AF37]"></div>
      </div>

      {/* Golden accent shapes */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#D4AF37] rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#D4AF37] rotate-12"></div>
      </div>
      
      <AdminSidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-y-auto relative z-10"
      >
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}