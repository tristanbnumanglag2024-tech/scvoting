import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import logo1 from '../../imports/image.png';
import logo2 from '../../imports/image-2.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        window.location.href = "/vote";
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#6b0019] to-[#4a0012] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        {/* Geometric golden pattern */}
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
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full border-4 border-[#D4AF37]"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full border-2 border-[#D4AF37]"></div>
      </div>

      {/* Golden accent shapes */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37] rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#D4AF37] rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#D4AF37] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#D4AF37]">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#b8922f] p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <img src={logo1} alt="MMSU Logo" className="w-16 h-16 object-contain" />
                <img src={logo2} alt="COE Logo" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-2xl md:text-3xl text-[#800020] mb-2 font-bold">MMSU COE Student Council</h1>
              <p className="text-[#600018] font-medium">Official Election System</p>
            </motion.div>
          </div>

          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-6 text-[#800020]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl">Secure Login</h2>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
                >
                  <p className="text-red-700">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-[#800020]">
                    Email Address
                  </label>
                  <input
               
  id="email"
  type="text"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
  placeholder="Enter email (admin) or student number"
  required
/>
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-[#800020]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#800020] to-[#a0002a] text-white py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#b8922f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>
              </form>

            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-[#800020] text-sm font-medium drop-shadow-sm"
        >
          Mariano Marcos State University • College of Engineering
        </motion.p>
      </motion.div>
    </div>
  );
}