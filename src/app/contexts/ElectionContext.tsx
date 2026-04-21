import { createContext, useContext, useState, ReactNode } from 'react';

export interface Position {
  id: string;
  name: string;
  order: number;
}

export interface Candidate {
  id: string;
  positionId: string;
  firstName: string;
  lastName: string;
  course: string;
  section: string;
  picture: string;
  vision: string;
  votes: number;
}

interface ElectionContextType {
  positions: Position[];
  candidates: Candidate[];
  addPosition: (name: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  vote: (candidateId: string) => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

const MOCK_POSITIONS: Position[] = [
  { id: '1', name: 'President', order: 1 },
  { id: '2', name: 'Vice President', order: 2 },
  { id: '3', name: 'Secretary', order: 3 },
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    positionId: '1',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    course: 'Computer Engineering',
    section: 'CPE-4A',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    vision: 'To foster innovation and excellence in our engineering programs while promoting inclusivity and student welfare.',
    votes: 45,
  },
  {
    id: '2',
    positionId: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    course: 'Electrical Engineering',
    section: 'EE-4B',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    vision: 'Building a stronger community through collaboration and championing sustainable engineering practices.',
    votes: 38,
  },
  {
    id: '3',
    positionId: '2',
    firstName: 'Carlos',
    lastName: 'Reyes',
    course: 'Mechanical Engineering',
    section: 'ME-4A',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    vision: 'Dedicated to improving student services and creating more opportunities for practical learning experiences.',
    votes: 52,
  },
];

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);

  const addPosition = (name: string) => {
    const newPosition: Position = {
      id: Date.now().toString(),
      name,
      order: positions.length + 1,
    };
    setPositions([...positions, newPosition]);
  };

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      votes: 0,
    };
    setCandidates([...candidates, newCandidate]);
  };

  const vote = (candidateId: string) => {
    setCandidates(candidates.map(c =>
      c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
    ));
  };

  return (
    <ElectionContext.Provider value={{ positions, candidates, addPosition, addCandidate, vote }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}
