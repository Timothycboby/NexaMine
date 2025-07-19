import React, { useState } from "react";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileVideo, FaFileArchive, FaFileAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e42', '#ef4444', '#3b82f6', '#eab308', '#a21caf', '#ec4899', '#16a34a', '#64748b'];

const fileTypeMeta = {
  pdf: { icon: <FaFilePdf className="text-red-500" /> },
  docx: { icon: <FaFileWord className="text-blue-500" /> },
  jpg: { icon: <FaFileImage className="text-pink-500" /> },
  mp4: { icon: <FaFileVideo className="text-purple-500" /> },
  zip: { icon: <FaFileArchive className="text-gray-500" /> },
  txt: { icon: <FaFileAlt className="text-gray-400" /> },
  default: { icon: <FaFileAlt className="text-gray-400" /> },
};

// Dummy database files
const dbFiles = [
  { name: "Invoice.pdf", type: "pdf" },
  { name: "Notes.txt", type: "txt" },
  { name: "Photo.jpg", type: "jpg" },
  { name: "Video.mp4", type: "mp4" },
  { name: "Archive.zip", type: "zip" },
];

const initialSharedFiles = [
  {
    name: "Resume.pdf",
    type: "pdf",
    sharedWith: ["alice@example.com", "+919876543210"],
    shareCount: 3,
    history: [
      { to: "alice@example.com", date: "2024-06-10T12:00:00Z", downloads: 1, gb: 0.2 },
      { to: "+919876543210", date: "2024-06-11T09:30:00Z", downloads: 2, gb: 0.4 },
    ],
    accessStats: [
      { user: "alice@example.com", accesses: 1, gb: 0.2 },
      { user: "+919876543210", accesses: 2, gb: 0.4 },
    ],
    totalGB: 0.6,
  },
  {
    name: "Project.docx",
    type: "docx",
    sharedWith: ["carol@example.com", "+911234567890"],
    shareCount: 2,
    history: [
      { to: "carol@example.com", date: "2024-06-09T10:20:00Z", downloads: 1, gb: 0.1 },
      { to: "+911234567890", date: "2024-06-12T11:00:00Z", downloads: 1, gb: 0.1 },
    ],
    accessStats: [
      { user: "carol@example.com", accesses: 1, gb: 0.1 },
      { user: "+911234567890", accesses: 1, gb: 0.1 },
    ],
    totalGB: 0.2,
  },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

const Shared = () => {
  const [sharedFiles, setSharedFiles] = useState(initialSharedFiles);
  const [expanded, setExpanded] = useState(null);
  const [phone, setPhone] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [selectedFileIdx, setSelectedFileIdx] = useState(null);
  const [userControl, setUserControl] = useState({});
  // New: database share state
  const [dbShareFile, setDbShareFile] = useState("");
  const [dbShareTo, setDbShareTo] = useState("");
  const [dbShareMsg, setDbShareMsg] = useState("");

  React.useEffect(() => {
    // Reset userControl when sharedFiles changes
    setUserControl(userList.reduce((acc, u) => {
      acc[u.user] = userControl[u.user] || { blocked: false, speed: 'normal', power: 'read' };
      return acc;
    }, {}));
    // eslint-disable-next-line
  }, [sharedFiles.length]);

  const handleShareByPhone = (idx) => {
    if (!phone.match(/^\+?\d{10,15}$/)) {
      setShareMsg("Please enter a valid phone number (with country code)");
      return;
    }
    const updated = [...sharedFiles];
    updated[idx].sharedWith.push(phone);
    updated[idx].history.push({ to: phone, date: new Date().toISOString(), downloads: 0, gb: 0 });
    updated[idx].accessStats.push({ user: phone, accesses: 0, gb: 0 });
    setSharedFiles(updated);
    setShareMsg(`File shared with ${phone}`);
    setPhone("");
    setTimeout(() => setShareMsg(""), 2000);
  };

  // New: share from database
  const handleDbShare = () => {
    if (!dbShareFile || !dbShareTo) {
      setDbShareMsg("Select a file and enter a user (email or phone)");
      return;
    }
    // Add to sharedFiles
    const file = dbFiles.find(f => f.name === dbShareFile);
    setSharedFiles(prev => [
      ...prev,
      {
        name: file.name,
        type: file.type,
        sharedWith: [dbShareTo],
        shareCount: 1,
        history: [{ to: dbShareTo, date: new Date().toISOString(), downloads: 0, gb: 0 }],
        accessStats: [{ user: dbShareTo, accesses: 0, gb: 0 }],
        totalGB: 0,
      },
    ]);
    setDbShareMsg(`File '${file.name}' shared with ${dbShareTo}`);
    setDbShareFile("");
    setDbShareTo("");
    setTimeout(() => setDbShareMsg(""), 2000);
  };

  const handleBlockToggle = (user) => {
    setUserControl(prev => ({ ...prev, [user]: { ...prev[user], blocked: !prev[user].blocked } }));
  };
  const handleSpeedChange = (user, speed) => {
    setUserControl(prev => ({ ...prev, [user]: { ...prev[user], speed } }));
  };
  const handlePowerChange = (user, power) => {
    setUserControl(prev => ({ ...prev, [user]: { ...prev[user], power } }));
  };

  // Graph 1: Total downloads per file
  const totalDownloadsPerFile = sharedFiles.map(f => ({ name: f.name, downloads: f.accessStats.reduce((a, b) => a + b.accesses, 0) }));

  // Graph 2: Total downloads by user (across all files)
  const userDownloadMap = {};
  sharedFiles.forEach(f => {
    f.accessStats.forEach(u => {
      if (!userDownloadMap[u.user]) userDownloadMap[u.user] = 0;
      userDownloadMap[u.user] += u.accesses;
    });
  });
  const totalDownloadsByUser = Object.entries(userDownloadMap).map(([user, downloads], i) => ({ user, downloads, color: COLORS[i % COLORS.length] }));

  // User list for table and control center
  const userList = Object.entries(userDownloadMap).map(([user, downloads]) => {
    // Find total GB for this user
    let gb = 0;
    sharedFiles.forEach(f => {
      const stat = f.accessStats.find(s => s.user === user);
      if (stat) gb += stat.gb;
    });
    return { user, downloads, gb };
  });

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Shared Files</h1>
      {/* Database Share Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
          <select
            className="w-full sm:w-56 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dbShareFile}
            onChange={e => setDbShareFile(e.target.value)}
          >
            <option value="">Select file from database</option>
            {dbFiles.map((f, i) => (
              <option key={i} value={f.name}>{f.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Share to (email or phone)"
            className="w-full sm:w-56 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dbShareTo}
            onChange={e => setDbShareTo(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-indigo-500 text-white text-sm hover:bg-indigo-600"
            onClick={handleDbShare}
          >
            Share
          </button>
        </div>
        {dbShareMsg && <span className="text-xs text-green-600">{dbShareMsg}</span>}
      </div>
      {/* Control Center */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Control Center</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-2">User</th>
                <th className="py-2 px-2">Block</th>
                <th className="py-2 px-2">Speed</th>
                <th className="py-2 px-2">Access Power</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((u, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-2 font-medium text-gray-900 dark:text-white">{u.user}</td>
                  <td className="py-2 px-2">
                    <button
                      className={`px-3 py-1 rounded text-xs font-bold ${userControl[u.user]?.blocked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                      onClick={() => handleBlockToggle(u.user)}
                    >
                      {userControl[u.user]?.blocked ? 'Blocked' : 'Active'}
                    </button>
                  </td>
                  <td className="py-2 px-2">
                    <select
                      className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs px-2 py-1"
                      value={userControl[u.user]?.speed}
                      onChange={e => handleSpeedChange(u.user, e.target.value)}
                      disabled={userControl[u.user]?.blocked}
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <select
                      className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs px-2 py-1"
                      value={userControl[u.user]?.power}
                      onChange={e => handlePowerChange(u.user, e.target.value)}
                      disabled={userControl[u.user]?.blocked}
                    >
                      <option value="read">Read Only</option>
                      <option value="full">Full Access</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Main Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
        {/* Total downloads per file */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Total Downloads per File</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={totalDownloadsPerFile}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="downloads" fill="#6366f1" name="Downloads" barSize={28} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Total downloads by user */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Total Downloads by User</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={totalDownloadsByUser} dataKey="downloads" nameKey="user" cx="50%" cy="50%" outerRadius={70} label>
                {totalDownloadsByUser.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* User List Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">User Download List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-2">User</th>
                <th className="py-2 px-2">Total Downloads</th>
                <th className="py-2 px-2">Total GB Downloaded</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((u, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-2 font-medium text-gray-900 dark:text-white">{u.user}</td>
                  <td className="py-2 px-2 text-indigo-600 dark:text-indigo-400 font-bold">{u.downloads}</td>
                  <td className="py-2 px-2 text-fuchsia-600 dark:text-fuchsia-400 font-bold">{u.gb} GB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Shared Files List */}
      <div className="grid grid-cols-1 gap-6">
        {sharedFiles.map((file, idx) => {
          const meta = fileTypeMeta[file.type] || fileTypeMeta.default;
          return (
            <div key={idx} className="rounded-xl shadow-md p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="text-3xl">{meta.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate text-gray-900 dark:text-white" title={file.name}>{file.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Shared with: {file.sharedWith.join(", ")}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Shares</div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{file.shareCount}</div>
                </div>
                <button
                  className="ml-0 md:ml-4 px-3 py-1 rounded bg-indigo-500 text-white text-xs hover:bg-indigo-600"
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                >
                  {expanded === idx ? 'Hide History' : 'Show History'}
                </button>
              </div>
              {/* Share by phone number */}
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <input
                  type="tel"
                  placeholder="Share via phone (+91...)"
                  className="w-full sm:w-64 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedFileIdx === idx ? phone : ""}
                  onChange={e => { setPhone(e.target.value); setSelectedFileIdx(idx); }}
                />
                <button
                  className="px-4 py-2 rounded bg-indigo-500 text-white text-sm hover:bg-indigo-600"
                  onClick={() => { setSelectedFileIdx(idx); handleShareByPhone(idx); }}
                >
                  Share
                </button>
                {selectedFileIdx === idx && shareMsg && (
                  <span className="text-xs text-green-600 ml-2">{shareMsg}</span>
                )}
              </div>
              {/* Access/Download Graph */}
              <div className="w-full mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Access & Download Stats</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={file.accessStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e42" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="accesses" fill="#6366f1" name="Accesses" barSize={18} radius={[6, 6, 0, 0]} />
                    <Bar yAxisId="right" dataKey="gb" fill="#f59e42" name="GB Downloaded" barSize={18} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Downloaded: <span className="font-bold text-indigo-600 dark:text-indigo-400">{file.totalGB} GB</span></div>
              </div>
              {expanded === idx && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3">
                  <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">Share History:</div>
                  <ul className="space-y-1">
                    {file.history.map((h, hidx) => (
                      <li key={hidx} className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>To: <span className="font-medium text-gray-900 dark:text-white">{h.to}</span></span>
                        <span>{formatDate(h.date)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shared; 