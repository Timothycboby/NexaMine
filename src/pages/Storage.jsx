import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Sparkles } from 'lucide-react';

const COLORS = ['#6366f1', '#22c55e', '#f59e42', '#ef4444', '#3b82f6', '#eab308', '#a21caf', '#ec4899', '#16a34a', '#64748b'];

// Dummy data for encrypted vs non-encrypted storage
const encryptionData = [
  { type: 'PDF', encrypted: 8, nonEncrypted: 4 },
  { type: 'DOCX', encrypted: 5, nonEncrypted: 3 },
  { type: 'XLSX', encrypted: 2, nonEncrypted: 3 },
  { type: 'JPG', encrypted: 10, nonEncrypted: 5 },
  { type: 'MP4', encrypted: 2, nonEncrypted: 1 },
  { type: 'ZIP', encrypted: 1, nonEncrypted: 1 },
];

// Prepare separate data for each graph
const encryptedData = encryptionData.map(d => ({ type: d.type, value: d.encrypted }));
const nonEncryptedData = encryptionData.map(d => ({ type: d.type, value: d.nonEncrypted }));

// Dummy data for storage types
const storageTypeData = [
  { name: 'Cloud', value: 40 },
  { name: 'Local', value: 25 },
  { name: 'Backup', value: 20 },
  { name: 'External', value: 10 },
  { name: 'Shared', value: 5 },
];

const aiTips = [
  "Use encryption for sensitive files to enhance security.",
  "Regularly backup your important data to multiple storage types.",
  "Monitor your storage usage trends to avoid running out of space.",
  "Organize files by type and date for faster access.",
  "Use cloud storage for easy sharing and remote access.",
  "Delete or archive old files to optimize storage.",
  "Enable two-factor authentication for your storage accounts.",
  "Compress large files to save space.",
  "Schedule regular security audits of your storage.",
  "Leverage AI tools to detect duplicate or unused files.",
];

const Storage = () => {
  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Storage Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 mb-12">
        {/* Encrypted Storage Graph */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-xl text-gray-800 dark:text-gray-100 text-center">Encrypted Storage by Type</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={encryptedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" name="Encrypted" barSize={30} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Non-Encrypted Storage Graph */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-xl text-gray-800 dark:text-gray-100 text-center">Non-Encrypted Storage by Type</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={nonEncryptedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#f59e42" name="Non-Encrypted" barSize={30} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Storage Types Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col items-center mb-12">
        <h2 className="font-semibold mb-4 text-xl text-gray-800 dark:text-gray-100 text-center">Storage by Type</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={storageTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {storageTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col items-center mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-7 h-7 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Storage Assistant</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {aiTips.map((tip, idx) => (
            <li key={idx} className="bg-white/80 dark:bg-gray-900/60 rounded-lg px-5 py-3 text-gray-800 dark:text-gray-100 shadow-md flex items-start gap-2">
              <span className="text-indigo-500 font-bold">AI:</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Storage; 