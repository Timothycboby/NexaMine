import { useStorage } from '../contexts/StorageContext';
import { Undo2 } from 'lucide-react';

const Trash = () => {
  const { files, restoreFile } = useStorage();
  const trashedFiles = files.filter(file => file.trashed);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Trash</h1>
      {trashedFiles.length === 0 ? (
        <div className="text-gray-500">Trash is empty.</div>
      ) : (
        <ul className="space-y-4">
          {trashedFiles.map(file => (
            <li key={file.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <span>{file.name}</span>
              <button
                onClick={() => restoreFile(file.id)}
                className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                <Undo2 className="w-4 h-4 mr-1" /> Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trash; 