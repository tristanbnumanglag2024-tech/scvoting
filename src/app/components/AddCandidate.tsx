import { useState, useEffect } from 'react';
import { useElection } from '../contexts/ElectionContext';
import { motion } from 'motion/react';
import { UserPlus, Upload, Users } from 'lucide-react';
import { toast } from 'sonner';

// ✅ TYPE
type Candidate = {
  id: number;
  position_id: string;
  first_name: string;
  last_name: string;
  course: string;
  section: string;
  picture: string;
  vision: string;
};

export default function AddCandidate() {
 const [positions, setPositions] = useState<any[]>([]);

  // ✅ STATE
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    positionId: string;
    firstName: string;
    lastName: string;
    course: string;
    section: string;
    picture: File | null;
    vision: string;
  }>({
    positionId: '',
    firstName: '',
    lastName: '',
    course: '',
    section: '',
    picture: null,
    vision: '',
  });

  // ✅ FETCH FUNCTION
  const fetchCandidates = async () => {
    try {
      const res = await fetch("http://localhost/SCVOTE/get_candidates.php");
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    }
  };
const fetchPositions = async () => {
  try {
    const res = await fetch("http://localhost/SCVOTE/get_positions.php");
    const data = await res.json();
    setPositions(data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch positions");
  }
};
  // ✅ LOAD ON START
  useEffect(() => {
    fetchCandidates();
     fetchPositions();
  }, []);

  // ✅ SUBMIT (ADD + EDIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.picture && !isEdit) {
      toast.error("Please upload a picture");
      return;
    }

    const data = new FormData();
    data.append("positionId", formData.positionId);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("course", formData.course);
    data.append("section", formData.section);
    data.append("vision", formData.vision);

    if (formData.picture) {
      data.append("picture", formData.picture);
    }

    let url = "http://localhost/SCVOTE/add_candidate.php";

    if (isEdit && editId) {
      url = "http://localhost/SCVOTE/update_candidate.php";
      data.append("id", editId.toString());
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success(isEdit ? "Candidate updated!" : "Candidate added!");

        fetchCandidates();

        setIsEdit(false);
        setEditId(null);

        setFormData({
          positionId: '',
          firstName: '',
          lastName: '',
          course: '',
          section: '',
          picture: null,
          vision: '',
        });

      } else {
        toast.error("Failed operation");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ EDIT FUNCTION
  const handleEdit = (candidate: Candidate) => {
    setIsEdit(true);
    setEditId(candidate.id);

    setFormData({
      positionId: candidate.position_id,
      firstName: candidate.first_name,
      lastName: candidate.last_name,
      course: candidate.course,
      section: candidate.section,
      picture: null,
      vision: candidate.vision,
    });

    toast.info("Edit mode enabled");
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      const data = new FormData();
      data.append("id", id.toString());

      const res = await fetch("http://localhost/SCVOTE/delete_candidate.php", {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success("Deleted successfully");
        fetchCandidates();
      }

    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ✅ INPUT HANDLER
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl text-[#D4AF37] mb-2 font-bold">Add Candidate</h1>
        <p className="text-[#666666]">Register new candidates for the election</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-[#D4AF37]/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl text-[#800020] font-bold">Candidate Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-[#800020]">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-2 text-[#800020]">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

          
              <div>
  <label htmlFor="course" className="block mb-2 text-[#800020]">
    Course
  </label>

  <select
    id="course"
    name="course"
    value={formData.course}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all appearance-none"
    required
  >
    <option value="">Select Course</option>
    {["ABE","CE","CES","CHE","CPE","EE","ECE","ME"].map(course => (
      <option key={course} value={course}>
        {course}
      </option>
    ))}
  </select>
</div>

              <div>
  <label htmlFor="section" className="block mb-2 text-[#800020]">
    Section
  </label>

  <select
    id="section"
    name="section"
    value={formData.section}
    onChange={handleChange}
    className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all appearance-none"
    required
  >
    <option value="">Select Section</option>

    {[1,2,3,4,5].map(year =>
      ["A","B","C"].map(sec => {
        const value = `${year}-${sec}`;
        return (
          <option key={value} value={value}>
            {value}
          </option>
        );
      })
    )}
  </select>
</div>

            <div>
  <label htmlFor="positionId" className="block mb-2 text-[#800020]">
    Position
  </label>

  <div className="relative">
    <select
      id="positionId"
      name="positionId"
      value={formData.positionId}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all appearance-none"
      required
    >
      <option value="">Select a position</option>
      {positions.map(position => (
        <option key={position.id} value={position.id}>
          {position.name}
        </option>
      ))}
    </select>

    {/* dropdown icon */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#800020]/50">
      ▼
    </div>
  </div>
</div>

            <div>
  <label htmlFor="picture" className="block mb-2 text-[#800020]">
    Upload Picture
  </label>

 <div className="relative">
  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#800020]/50" />

  <input
    id="picture"
    name="picture"
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFormData({
          ...formData,
          picture: e.target.files[0],
        });
      }
    }}
    className="w-full pl-12 pr-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
    required
  />
</div>
</div>

            <div>
              <label htmlFor="vision" className="block mb-2 text-[#800020]">
                Vision Statement
              </label>
              <textarea
                id="vision"
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none"
                placeholder="Enter the candidate's vision for the position..."
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#800020] to-[#a0002a] text-white py-4 rounded-lg hover:shadow-lg transition-all relative overflow-hidden group font-bold"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                {isEdit ? "Update Candidate" : "Add Candidate"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#b8922f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#b8922f] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-xl text-[#800020] font-bold">Total Candidates</h2>
          </div>

          <div className="text-center py-6">
            <div className="text-5xl md:text-6xl font-bold text-[#D4AF37] mb-2">{candidates.length}</div>
            <p className="text-[#666666]">Registered Candidates</p>
          </div>

          <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
            {candidates.map((candidate, index) => (
             <motion.div
  key={candidate.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 + index * 0.05 }}
  className="p-3 bg-gradient-to-r from-[#fdfbf7] to-white rounded-lg border border-[#800020]/10"
>
  <img
    src={`http://localhost/SCVOTE/${candidate.picture}`}
    className="w-10 h-10 rounded-full object-cover mb-2"
  />

  <p className="font-semibold text-[#800020] text-sm">
    {candidate.first_name} {candidate.last_name}
  </p>

  <p className="text-xs text-[#666666]">{candidate.course}</p>

  <div className="flex gap-2 mt-2">
    <button
      onClick={() => handleEdit(candidate)}
      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(candidate.id)}
      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete
    </button>
  </div>
</motion.div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}