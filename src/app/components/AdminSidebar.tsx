import { NavLink } from 'react-router';
import { BarChart3, UserPlus, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import logo1 from '../../imports/image.png';
import logo2 from '../../imports/image-2.png';

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard', end: true },
    { to: '/admin/positions', icon: Trophy, label: 'Add Position' },
    { to: '/admin/candidates', icon: UserPlus, label: 'Add Candidate' },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="w-72 bg-gradient-to-b from-[#800020] to-[#600018] text-white h-screen flex flex-col shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>

      {/* Header with Logos */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo1} alt="MMSU Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1.5" />
          <img src={logo2} alt="COE Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1.5" />
        </div>
        <h2 className="text-center text-sm font-bold mb-4 text-[#D4AF37]">MMSU COE Student Council</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#b8922f] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-[#800020] font-bold text-lg">
              {user?.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate">{user?.name}</h3>
            <p className="text-[#D4AF37] text-sm">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 relative">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#800020] shadow-lg'
                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-white transition-all group"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}