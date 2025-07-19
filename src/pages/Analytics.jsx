import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, ScatterChart, Scatter, RadialBarChart, RadialBar, ComposedChart } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e42', '#ef4444', '#3b82f6', '#eab308', '#a21caf', '#ec4899', '#16a34a', '#64748b'];

// Dummy data for various graphs
const fileTypeData = [
  { type: 'PDF', value: 12 },
  { type: 'DOCX', value: 8 },
  { type: 'XLSX', value: 5 },
  { type: 'JPG', value: 15 },
  { type: 'PNG', value: 10 },
  { type: 'MP4', value: 3 },
  { type: 'MP3', value: 7 },
  { type: 'ZIP', value: 2 },
  { type: 'TXT', value: 6 },
  { type: 'JS', value: 4 },
];
const storageTrend = [
  { month: 'Jan', used: 2 },
  { month: 'Feb', used: 3 },
  { month: 'Mar', used: 4 },
  { month: 'Apr', used: 5 },
  { month: 'May', used: 6 },
  { month: 'Jun', used: 7 },
  { month: 'Jul', used: 8 },
  { month: 'Aug', used: 9 },
  { month: 'Sep', used: 10 },
  { month: 'Oct', used: 11 },
  { month: 'Nov', used: 12 },
  { month: 'Dec', used: 13 },
];
const uploadActivity = [
  { day: 'Mon', uploads: 5 },
  { day: 'Tue', uploads: 8 },
  { day: 'Wed', uploads: 6 },
  { day: 'Thu', uploads: 10 },
  { day: 'Fri', uploads: 7 },
  { day: 'Sat', uploads: 3 },
  { day: 'Sun', uploads: 2 },
];
const folderFileCounts = [
  { name: 'Projects', files: 10, folders: 2 },
  { name: 'Photos', files: 20, folders: 5 },
  { name: 'Music', files: 15, folders: 3 },
  { name: 'Docs', files: 8, folders: 1 },
];
const userGrowth = [
  { month: 'Jan', users: 100 },
  { month: 'Feb', users: 120 },
  { month: 'Mar', users: 150 },
  { month: 'Apr', users: 180 },
  { month: 'May', users: 210 },
  { month: 'Jun', users: 250 },
];
const fileSizeDist = [
  { size: '0-1MB', count: 20 },
  { size: '1-10MB', count: 15 },
  { size: '10-100MB', count: 8 },
  { size: '100MB+', count: 2 },
];
const fileTypeRadar = [
  { type: 'PDF', value: 120 },
  { type: 'DOCX', value: 98 },
  { type: 'XLSX', value: 86 },
  { type: 'JPG', value: 99 },
  { type: 'PNG', value: 85 },
];
const scatterData = [
  { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }, { x: 5, y: 10 },
];
const radialBarData = [
  { name: 'Storage', uv: 80, fill: '#6366f1' },
  { name: 'Files', uv: 60, fill: '#22c55e' },
  { name: 'Folders', uv: 40, fill: '#f59e42' },
];
const composedData = [
  { name: 'Jan', uv: 400, pv: 240, amt: 240 },
  { name: 'Feb', uv: 300, pv: 139, amt: 221 },
  { name: 'Mar', uv: 200, pv: 980, amt: 229 },
  { name: 'Apr', uv: 278, pv: 390, amt: 200 },
  { name: 'May', uv: 189, pv: 480, amt: 218 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* 1. Pie Chart - File Types */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">File Types Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={fileTypeData} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                {fileTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 2. Bar Chart - Storage Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Storage Usage Trend (GB)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={storageTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* 3. Line Chart - Upload Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Weekly Upload Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={uploadActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uploads" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* 4. Area Chart - User Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">User Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* 5. Radar Chart - File Type Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">File Type Radar</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={fileTypeRadar} outerRadius={90}>
              <PolarGrid />
              <PolarAngleAxis dataKey="type" />
              <PolarRadiusAxis />
              <Radar name="Files" dataKey="value" stroke="#f59e42" fill="#f59e42" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* 6. Scatter Chart - File Size vs Count */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Scatter: File Size vs Count</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="x" name="File Size (MB)" />
              <YAxis dataKey="y" name="Count" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Files" data={scatterData} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* 7. Radial Bar Chart - Storage, Files, Folders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Radial Bar: Storage, Files, Folders</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart innerRadius="20%" outerRadius="90%" data={radialBarData} startAngle={180} endAngle={0}>
              <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="uv" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        {/* 8. Composed Chart - Multi-metric */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Composed Chart (Multi-metric)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={composedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* 9. File Size Distribution - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">File Size Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fileSizeDist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* 10. Folder/File Counts - Stacked Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">Folder/File Counts</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={folderFileCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="files" stackId="a" fill="#6366f1" />
              <Bar dataKey="folders" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 