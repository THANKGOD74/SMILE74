import React, { useEffect, useState } from 'react';
import type { Task } from '../types';
import { fetchTrashedTasks, restoreTask, permanentDeleteTask } from '../services/api';

const TrashPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTrashedTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleRestore = async (id: string) => {
    await restoreTask(id);
    loadTasks();
  };

  const handlePermanentDelete = async (id: string) => {
    if (window.confirm('Permanently delete this task? This cannot be undone.')) {
      await permanentDeleteTask(id);
      loadTasks();
    }
  };

  if (loading) return <div className="text-center py-10">Loading trash...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#134E4A] mb-6">🗑️ Trash</h1>
      {tasks.length === 0 ? (
        <p className="text-[#6b7280]">Your trash is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-[#FFFFFF] p-4 rounded shadow border border-[#E5E7EB]">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-sm text-[#4B5563]">{task.description || 'No description'}</p>
              <p className="text-xs text-[#9CA3AF]">Deleted at: {new Date((task as any).deletedAt!).toLocaleString()}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleRestore(task._id)}
                  className="bg-[#22c55e] hover:bg-[#059669] text-[#FFFFFF] px-3 py-1 rounded text-sm"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(task._id)}
                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1 rounded text-sm"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;