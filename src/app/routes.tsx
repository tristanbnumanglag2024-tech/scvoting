import { createBrowserRouter, Navigate } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserVoting from './pages/UserVoting';
import VotingResults from './components/VotingResults';
import AddPosition from './components/AddPosition';
import AddCandidate from './components/AddCandidate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <VotingResults />,
      },
      {
        path: 'positions',
        element: <AddPosition />,
      },
      {
        path: 'candidates',
        element: <AddCandidate />,
      },
    ],
  },
  {
    path: '/vote',
    element: (
      <ProtectedRoute role="user">
        <UserVoting />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);