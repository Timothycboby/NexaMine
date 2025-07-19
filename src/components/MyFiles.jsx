import React, { useState } from "react";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileVideo, FaFileArchive, FaFileAlt, FaFileExcel, FaFilePowerpoint, FaFileAudio, FaFileCode, FaFolder, FaFolderOpen, FaFolderPlus, FaFolderMinus } from "react-icons/fa";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { useTheme } from '../contexts/ThemeContext';

const folderIcons = [FaFolder, FaFolderOpen, FaFolderPlus, FaFolderMinus];

const fileTypeMeta = {
  pdf: { icon: <FaFilePdf className="text-red-500" />, color: "bg-red-100 dark:bg-red-900/40" },
  docx: { icon: <FaFileWord className="text-blue-500" />, color: "bg-blue-100 dark:bg-blue-900/40" },
  xlsx: { icon: <FaFileExcel className="text-green-500" />, color: "bg-green-100 dark:bg-green-900/40" },
  pptx: { icon: <FaFilePowerpoint className="text-orange-500" />, color: "bg-orange-100 dark:bg-orange-900/40" },
  jpg: { icon: <FaFileImage className="text-pink-500" />, color: "bg-pink-100 dark:bg-pink-900/40" },
  png: { icon: <FaFileImage className="text-pink-400" />, color: "bg-pink-100 dark:bg-pink-900/40" },
  mp4: { icon: <FaFileVideo className="text-purple-500" />, color: "bg-purple-100 dark:bg-purple-900/40" },
  mp3: { icon: <FaFileAudio className="text-yellow-500" />, color: "bg-yellow-100 dark:bg-yellow-900/40" },
  zip: { icon: <FaFileArchive className="text-gray-500" />, color: "bg-gray-100 dark:bg-gray-900/40" },
  txt: { icon: <FaFileAlt className="text-gray-400" />, color: "bg-gray-100 dark:bg-gray-900/40" },
  js: { icon: <FaFileCode className="text-green-700" />, color: "bg-green-200 dark:bg-green-900/40" },
  default: { icon: <FaFileAlt className="text-gray-400" />, color: "bg-gray-100 dark:bg-gray-900/40" },
};

const initialFolders = [
  { name: "Projects", created: "2024-05-01T10:00:00Z", modified: "2024-06-01T12:00:00Z", icon: 0 },
  { name: "Photos", created: "2024-05-10T09:00:00Z", modified: "2024-06-05T15:00:00Z", icon: 1 },
  { name: "Music", created: "2024-05-15T08:00:00Z", modified: "2024-06-08T11:10:00Z", icon: 2 },
];

const dummyFiles = [
  { name: "Resume.pdf", type: "pdf", size: 234567, created: "2024-06-01T10:30:00Z", modified: "2024-06-10T12:00:00Z" },
  { name: "Project.docx", type: "docx", size: 123456, created: "2024-05-20T09:00:00Z", modified: "2024-06-09T15:20:00Z" },
  { name: "Data.xlsx", type: "xlsx", size: 345678, created: "2024-05-15T08:00:00Z", modified: "2024-06-08T11:10:00Z" },
  { name: "Presentation.pptx", type: "pptx", size: 456789, created: "2024-05-10T07:00:00Z", modified: "2024-06-07T10:00:00Z" },
  { name: "Photo.jpg", type: "jpg", size: 567890, created: "2024-05-05T06:00:00Z", modified: "2024-06-06T09:00:00Z" },
  { name: "Screenshot.png", type: "png", size: 678901, created: "2024-05-01T05:00:00Z", modified: "2024-06-05T08:00:00Z" },
  { name: "Movie.mp4", type: "mp4", size: 7890123, created: "2024-04-25T04:00:00Z", modified: "2024-06-04T07:00:00Z" },
  { name: "Song.mp3", type: "mp3", size: 890123, created: "2024-04-20T03:00:00Z", modified: "2024-06-03T06:00:00Z" },
  { name: "Archive.zip", type: "zip", size: 901234, created: "2024-04-15T02:00:00Z", modified: "2024-06-02T05:00:00Z" },
  { name: "Notes.txt", type: "txt", size: 12345, created: "2024-04-10T01:00:00Z", modified: "2024-06-01T04:00:00Z" },
  { name: "Script.js", type: "js", size: 23456, created: "2024-04-05T00:00:00Z", modified: "2024-05-31T03:00:00Z" },
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

const totalSize = dummyFiles.reduce((sum, file) => sum + file.size, 0);

// Pie chart data for file type usage
const fileTypeSizes = {};
dummyFiles.forEach(file => {
  fileTypeSizes[file.type] = (fileTypeSizes[file.type] || 0) + file.size;
});
const pieData = {
  labels: Object.keys(fileTypeSizes).map(type => type.toUpperCase()),
  datasets: [
    {
      data: Object.values(fileTypeSizes),
      backgroundColor: Object.keys(fileTypeSizes).map(type => {
        switch(type) {
          case 'pdf': return '#ef4444';
          case 'docx': return '#3b82f6';
          case 'xlsx': return '#22c55e';
          case 'pptx': return '#f97316';
          case 'jpg': return '#ec4899';
          case 'png': return '#f472b6';
          case 'mp4': return '#a21caf';
          case 'mp3': return '#eab308';
          case 'zip': return '#6b7280';
          case 'txt': return '#9ca3af';
          case 'js': return '#16a34a';
          default: return '#64748b';
        }
      }),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#374151',
        font: { size: 15, weight: 'bold' },
        padding: 20,
        boxWidth: 24,
      },
    },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#6366f1',
      borderWidth: 1,
      padding: 12,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const MyFiles = () => {
  const { isDark } = useTheme();
  const [folders, setFolders] = useState(initialFolders);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState(0);

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditName(folders[idx].name);
    setEditIcon(folders[idx].icon);
  };

  const saveEdit = () => {
    setFolders(folders.map((f, i) => i === editIdx ? { ...f, name: editName, icon: editIcon } : f));
    setEditIdx(null);
    setEditName("");
  };

  const cancelEdit = () => {
    setEditIdx(null);
    setEditName("");
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">My Files</h1>
      {/* Graph Section */}
      <div className="mb-10 flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col items-center">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">Storage Usage by File Type</h2>
          <div className="w-full flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 h-64">
              <Pie data={pieData} options={{...pieOptions, plugins: { ...pieOptions.plugins, legend: { ...pieOptions.plugins.legend, labels: { ...pieOptions.plugins.legend.labels, color: isDark ? '#fff' : '#374151' }}}}} />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center md:items-start">
              <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{formatSize(totalSize)}</div>
              <div className="text-gray-600 dark:text-gray-300 mb-2">Total Storage Used</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300" style={{ width: `${Math.min((totalSize / (10 * 1024 * 1024)) * 100, 100)}%` }}></div>
              </div>
              <div className="text-xs text-gray-400">(Assuming 10 MB quota for demo)</div>
            </div>
          </div>
        </div>
      </div>
      {/* Folders Grid */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Folders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {folders.map((folder, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-md p-4 sm:p-5 flex flex-col gap-3 bg-yellow-100 dark:bg-yellow-900/40 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl text-yellow-500">
                  {editIdx === idx ? (
                    <select
                      className="bg-yellow-50 dark:bg-yellow-900/60 border border-yellow-300 dark:border-yellow-700 rounded-lg p-1 text-2xl"
                      value={editIcon}
                      onChange={e => setEditIcon(Number(e.target.value))}
                    >
                      {folderIcons.map((Icon, i) => (
                        <option value={i} key={i}>{String.fromCodePoint(0x1F4C1 + i)}</option>
                      ))}
                    </select>
                  ) : (
                    React.createElement(folderIcons[folder.icon] || FaFolder)
                  )}
                </div>
                <div className="flex-1">
                  {editIdx === idx ? (
                    <input
                      className="w-full px-2 py-1 rounded border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/60 text-gray-900 dark:text-white font-semibold"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <div className="font-semibold text-lg truncate text-gray-900 dark:text-white" title={folder.name}>{folder.name}</div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">FOLDER</div>
                </div>
                <div className="flex gap-2">
                  {editIdx === idx ? (
                    <>
                      <button onClick={saveEdit} className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-xs">Save</button>
                      <button onClick={cancelEdit} className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 text-xs">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(idx)} className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs">Edit</button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-sm text-gray-700 dark:text-gray-200"><span className="font-medium">Created:</span> {formatDate(folder.created)}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200"><span className="font-medium">Modified:</span> {formatDate(folder.modified)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Files Grid */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {dummyFiles.map((file, idx) => {
          const meta = fileTypeMeta[file.type] || fileTypeMeta.default;
          return (
            <div
              key={idx}
              className={`rounded-xl shadow-md p-4 sm:p-5 flex flex-col gap-3 ${meta.color} hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{meta.icon}</div>
                <div>
                  <div className="font-semibold text-lg truncate text-gray-900 dark:text-white" title={file.name}>{file.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{file.type.toUpperCase()}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-sm text-gray-700 dark:text-gray-200"><span className="font-medium">Size:</span> {formatSize(file.size)}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200"><span className="font-medium">Created:</span> {formatDate(file.created)}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200"><span className="font-medium">Modified:</span> {formatDate(file.modified)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyFiles; 