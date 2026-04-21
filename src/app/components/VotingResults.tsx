import { useState, useEffect } from 'react'; // ✅ ADD THIS
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Trophy, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (positionName: string, data: any[]) => {
  const worksheetData = data.map((c, index) => ({
    Rank: index + 1,
    Name: c.name,
    Course: c.course,
    Votes: c.votes,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, positionName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `${positionName}_Results.xlsx`);
};


const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.[0]) return;

  const file = e.target.files[0];
  const data = new FormData();
  data.append("file", file);

  fetch("http://localhost/SCVOTE/upload_students.php", {
    method: "POST",
    body: data
  })
    .then(res => res.json())
    .then(result => {
      if (result.status === "success") {
        toast.success("Students uploaded!");
      } else {
        toast.error("Upload failed");
      }
    })
    .catch(() => toast.error("Server error"));
};

export default function VotingResults() {

  // ✅ MOVE HOOKS INSIDE COMPONENT
  const [positions, setPositions] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost/SCVOTE/get_results.php", {
        credentials: "include"
      });

      const data = await res.json();

      const mappedCandidates = data.map((item: any) => ({
        id: item.candidate_id,
        positionId: item.position_id,
        firstName: item.first_name,
        lastName: item.last_name,
        course: item.course,
        votes: Number(item.votes),
      }));

      setCandidates(mappedCandidates);

      const uniquePositions = [
        ...new Map(
          data.map((item: any) => [
            item.position_id,
            { id: item.position_id, name: item.position_name }
          ])
        ).values()
      ];

      setPositions(uniquePositions);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load results");
    }
  };

  const getChartData = (positionId: string) => {
    const positionCandidates = candidates.filter(c => c.positionId === positionId);
    return positionCandidates.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      votes: c.votes,
      course: c.course,
    }));
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const totalCandidates = candidates.length;
  const totalPositions = positions.length;

  return (
    // ✅ YOUR DESIGN BELOW (UNCHANGED)
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl text-[#D4AF37] mb-2 font-bold">Election Dashboard</h1>
        <p className="text-[#666666]">Real-time voting results and statistics</p>
      </motion.div>
<div className="bg-white rounded-xl shadow-lg p-4 border-2 border-[#D4AF37]/20">
  <h2 className="text-[#D4AF37] font-bold mb-2">Upload Students (CSV)</h2>

  <div className="flex gap-2 items-center">
    <input
      type="file"
      accept=".csv"
      onChange={handleUpload}
      className="px-2 py-1 border rounded"
    />

    <a
      href="http://localhost/SCVOTE/download_template.php"
      className="px-3 py-1 bg-[#800020] text-white rounded"
    >
      Download Template
    </a>
  </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full -mr-16 -mt-16 opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Votes</p>
                <p className="text-2xl md:text-3xl font-bold">{totalVotes}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#D4AF37] to-[#b8922f] rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/90 text-sm">Positions</p>
                <p className="text-2xl md:text-3xl font-bold">{totalPositions}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#600018] to-[#800020] rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full -mr-16 -mt-16 opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Candidates</p>
                <p className="text-2xl md:text-3xl font-bold">{totalCandidates}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        {positions.map((position, index) => {
          const chartData = getChartData(position.id);
          if (chartData.length === 0) return null;

          return (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-[#D4AF37]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#800020] to-[#a0002a] rounded-lg flex items-center justify-center text-white">
                  <Trophy className="w-5 h-5" />
                </div>
               <div className="flex justify-between items-center mb-4">
<div>
  <h2 className="text-xl md:text-2xl text-[#800020] font-bold">
    {position.name}
  </h2>
  <p className="text-[#666666] text-xs md:text-sm">
    {chartData.reduce((sum, c) => sum + c.votes, 0)} total votes
  </p>
</div>


</div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#666666', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#666666' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #D4AF37',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    dataKey="votes"
                    fill="#800020"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    name="Votes"
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartData.map((candidate, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#fdfbf7] to-white rounded-lg border border-[#800020]/10"
                  >
                    <div>
                      <p className="font-semibold text-[#800020]">{candidate.name}</p>
                      <p className="text-xs md:text-sm text-[#666666]">{candidate.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-bold text-[#D4AF37]">{candidate.votes}</p>
                      <p className="text-xs text-[#666666]">votes</p>
                    </div>
                  </div>
                ))}
              </div>

               <div className="flex justify-end mt-6">
  <button
    onClick={() => exportToExcel(position.name, chartData)}
    className="px-5 py-2 bg-gradient-to-r from-[#800020] to-[#a0002a] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
  >
    ⬇ Download Excel
  </button>
</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}