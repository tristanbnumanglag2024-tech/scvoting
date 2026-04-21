import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  course?: string; // ✅ ADD THIS
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // ✅ ADD THIS
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ IMPORTANT

  // ✅ CHECK SESSION
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://scvotingsytem.online/scelection/check_session.php", {
          credentials: "include"
        });

        const data = await res.json();

        if (data.loggedIn) {
         setUser({
  id: data.id,
  email: "",
  role: data.role === "admin" ? "admin" : "user",
  name: data.role === "admin" ? "Admin" : "Student",
  course: data.course // ✅ MUST EXIST
});
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false); // ✅ VERY IMPORTANT
    };

    checkSession();
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch("https://scvotingsytem.online/scelection/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (result.status === "success") {
      const userData: User = {
        id: result.id,
        email,
        role: result.role === "admin" ? "admin" : "user",
        name: result.role === "admin" ? "Admin" : "Student"
      };

      setUser(userData);
      return userData;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    await fetch("https://scvotingsytem.online/scelection/logout.php", {
      credentials: "include"
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}