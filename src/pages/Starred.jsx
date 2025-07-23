import { useStorage } from '../contexts/StorageContext';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import { useState } from 'react';

const Starred = () => {
  const { files, viewMode, selectedItems, setSelectedItems } = useStorage();
  const starredFiles = files.filter(file => file.starred);
  const [_, setDummy] = useState(false); // for possible future actions

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-yellow-600">Starred Files</h1>
      {starredFiles.length === 0 ? (
        <div className="text-gray-500">No starred files yet.</div>
      ) : viewMode === 'grid' ? (
        <FileGrid items={starredFiles} selectedItems={selectedItems} onItemClick={() => {}} />
      ) : (
        <FileList items={starredFiles} selectedItems={selectedItems} onItemClick={() => {}} />
      )}
    </div>
  );
};

export default Starred; 