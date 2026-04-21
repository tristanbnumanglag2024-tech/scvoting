import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, LogOut, CheckCircle, Award, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import logo1 from '../../imports/image.png';
import logo2 from '../../imports/image-2.png';

// ✅ TYPES (replace ElectionContext types)
type Position = {
  id: string;
  name: string;
};

type Candidate = {
  id: string;
  position_id: string;
  first_name: string;
  last_name: string;
  course: string;
  section: string;
  picture: string;
  vision: string;
};

export default function UserVoting() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [votes, setVotes] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const checkIfVoted = async () => {
  try {
    const res = await fetch("https://scvotingsytem.online/scelection/check_voted.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_id: user?.id
      })
    });

    const result = await res.json();

    if (result.voted) {
      setHasVoted(true);
    }

  } catch (err) {
    console.error(err);
  }
};
 const {  loading } = useAuth();


const fetchData = async (course: string) => {
  try {
    const res = await fetch("https://scvotingsytem.online/scelection/get_candidates_with_position.php");
    const data = await res.json();

    const userCourse = course.toUpperCase();

    const filtered = data.filter((c: any) => {
      const positionName = c.position_name.toUpperCase();

      if (!positionName.includes("REP")) return true;

      const [coursePart] = positionName.split(" ");

      return coursePart === userCourse;
    });

    console.log("USING COURSE:", userCourse);

    setCandidates(filtered);

    const uniquePositions = [
      ...new Map(
        filtered.map((item: any) => [
          item.position_id,
          { id: item.position_id, name: item.position_name }
        ])
      ).values()
    ];

    setPositions(uniquePositions as Position[]);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load candidates");
  }
};

useEffect(() => {
  if (!loading && user) {
    console.log("USER LOADED:", user);

    // 🔥 Wait until course exists
    if (user.course) {
      console.log("COURSE READY:", user.course);

      fetchData(user.course);
      checkIfVoted();
    } else {
      console.log("WAITING FOR COURSE...");
    }
  }
}, [user, loading]);
  const handleVoteSelection = (positionId: string, candidateId: string) => {
    if (hasVoted) return;
    setVotes({
      ...votes,
      [positionId]: candidateId,
    });
  };

  // ✅ FIXED SUBMIT (NO MORE vote())
  const handleSubmitVotes = async () => {
    const missingVotes = positions.filter(p => !votes[p.id]);

    if (missingVotes.length > 0) {
      toast.error(`Please vote for all positions`);
      return;
    }

    try {
      const res = await fetch("https://scvotingsytem.online/scelection/submit_votes.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: user?.id,
          votes
        })
      });

      const result = await res.json();

      if (result.status === "success") {
        setHasVoted(true);
        toast.success('Your votes have been submitted successfully!');
      } else {
        toast.error(result.message);
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ✅ FIXED FIELD NAME
  const getCandidatesForPosition = (positionId: string): Candidate[] => {
    return candidates.filter((c: any) => c.position_id == positionId);
  };


  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#6b0019] to-[#4a0012] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-10">
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
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#D4AF37] to-[#b8922f] rounded-full mb-6 shadow-2xl"
          >
            <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl text-white mb-4 font-bold px-4">Thank You for Voting!</h1>
          <p className="text-white/90 mb-8 max-w-md px-4">
            Your vote has been recorded. Thank you for participating in the MMSU College of Engineering Student Council Election.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#b8922f] text-[#800020] font-bold rounded-lg hover:shadow-lg transition-all"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#6b0019] to-[#4a0012] relative">
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

      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#800020] to-[#a0002a] text-white shadow-lg border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <img src={logo1} alt="MMSU Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain bg-white rounded-full p-1" />
                <img src={logo2} alt="COE Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain bg-white rounded-full p-1" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg md:text-2xl font-bold">MMSU COE Student Council</h1>
                <p className="text-white/80 text-xs md:text-sm">Welcome, {user?.name}</p>
              </div>
              <div className="md:hidden">
                <h1 className="text-sm font-bold">MMSU COE</h1>
                <p className="text-white/80 text-xs">{user?.name}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm md:text-base"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl text-[#800020] mb-2 font-bold">Cast Your Vote</h2>
          <p className="text-[#666666] text-sm md:text-base">Select one candidate for each position</p>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {positions.map((position, index) => {
            const positionCandidates = getCandidatesForPosition(position.id);
            if (positionCandidates.length === 0) return null;

            return (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 border-2 border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl text-[#800020] font-bold">{position.name}</h3>
                    <p className="text-[#666666] text-xs md:text-sm">Select one candidate</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {positionCandidates.map((candidate, candidateIndex) => {
                    const isSelected = votes[position.id] === candidate.id;

                    return (
                      <motion.button
                        key={candidate.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + candidateIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleVoteSelection(position.id, candidate.id)}
                        className={`text-left p-4 md:p-6 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 shadow-lg'
                            : 'border-[#800020]/10 hover:border-[#D4AF37]/50 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <img
                            src={`https://scvotingsytem.online/scelection/${candidate.picture}`}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                            className="w-full sm:w-24 h-48 sm:h-24 rounded-lg object-cover border-2 border-[#800020]/20 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg md:text-xl font-semibold text-[#800020] truncate">
                                  {candidate.first_name} {candidate.last_name}
                                </h4>
                                <p className="text-xs md:text-sm text-[#666666]">
                                  {candidate.course} • {candidate.section}
                                </p>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0"
                                >
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </motion.div>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-[#666666] line-clamp-3">{candidate.vision}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitVotes}
            disabled={Object.keys(votes).length !== positions.length}
            className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-[#800020] to-[#a0002a] text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-base md:text-lg font-bold"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Vote className="w-5 h-5 md:w-6 md:h-6" />
              Submit My Votes ({Object.keys(votes).length}/{positions.length})
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#b8922f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
          <p className="mt-4 text-[#666666] text-xs md:text-sm px-4">
            Please review your selections before submitting
          </p>
        </motion.div>
      </div>
    </div>
  );
}