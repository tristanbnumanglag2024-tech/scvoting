import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ElectionProvider } from './contexts/ElectionContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#800020',
              border: '2px solid #D4AF37',
              borderRadius: '0.5rem',
            },
          }}
        />
      </ElectionProvider>
    </AuthProvider>
  );
}