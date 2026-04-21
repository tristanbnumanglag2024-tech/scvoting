import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Plus, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';

export default function AddPosition() {
  const [positionName, setPositionName] = useState('');
  const [positions, setPositions] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ FETCH POSITIONS
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
    fetchPositions();
  }, []);

  // ✅ ADD / UPDATE POSITION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!positionName.trim()) {
      toast.error('Please enter a position name');
      return;
    }

    try {
      const data = new FormData();
      data.append("name", positionName);

      let url = "http://localhost/SCVOTE/add_position.php";

      if (isEdit && editId !== null) {
        url = "http://localhost/SCVOTE/update_position.php";
        data.append("id", editId.toString());
      }

      const res = await fetch(url, {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success(isEdit ? "Updated successfully!" : "Position added!");

        setPositionName('');
        setIsEdit(false);
        setEditId(null);

        fetchPositions();
      } else {
        toast.error("Operation failed");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ DELETE POSITION
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this position?")) return;

    try {
      const data = new FormData();
      data.append("id", id.toString());

      const res = await fetch("http://localhost/SCVOTE/delete_position.php", {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success("Position deleted!");
        fetchPositions();
      }

    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ✅ EDIT POSITION (YOU WERE MISSING THIS FUNCTION)
  const handleEdit = (position: any) => {
    setIsEdit(true);
    setEditId(position.id);
    setPositionName(position.name);

    toast.info("Edit mode enabled");
  };

  return (


  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl text-[#D4AF37] mb-2 font-bold">Add Position</h1>
      <p className="text-[#666666]">Create new positions for the student council election</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl text-[#800020] font-bold">New Position</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="position" className="block mb-2 text-[#800020]">
              Position Name
            </label>
            <input
              id="position"
              type="text"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-[#800020]/20 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              placeholder="e.g., President, Vice President, Secretary"
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
              <Plus className="w-5 h-5" />
              {isEdit ? "Update Position" : "Add Position"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#b8922f] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#b8922f] rounded-lg flex items-center justify-center">
            <ListOrdered className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl text-[#800020] font-bold">Existing Positions</h2>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {positions.length === 0 ? (
            <p className="text-[#666666] text-center py-8">No positions added yet</p>
          ) : (
            positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#fdfbf7] to-white rounded-lg border border-[#800020]/10 hover:border-[#D4AF37] transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-[#800020]">
                    {position.name}
                  </h3>

                  <p className="text-xs md:text-sm text-[#666666]">
                    Order: {position.display_order ?? position.order ?? 0}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setEditId(position.id);
                        setPositionName(position.name);
                        toast.info("Edit mode enabled");
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(position.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  </div>
);}