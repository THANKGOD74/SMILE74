import React, { useState, useEffect } from 'react';
import type { Task, TaskInput } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskForm from '../components/TaskFormComp/TaskForm';
import CategorySection from '../components/TaskFormComp/CategorySection';

export const MyTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTasks();
    // console.log('data', data);
    
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleSubmit = async (taskData: TaskInput) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      console.error('Failed to save task', err);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
      loadTasks();
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
    loadTasks();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group tasks by category (show only categories that have tasks)
// Use lowercase to match backend data
const categoryOrder = ['urgent', 'important', 'work', 'personal'];
const groupedTasks = categoryOrder.reduce((acc, cat) => {
  acc[cat] = tasks.filter(t => t.category.toLowerCase() === cat);
  return acc;
}, {} as Record<string, Task[]>);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-[#115E59]">Loading tasks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-[Poppins] font-semibold text-[#134E4A]">My Tasks</h1>
        <button
          onClick={handleAddNew}
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-[Poppins] font-normal px-5 py-2 rounded-full shadow transition"
        >
          + Add New Task
        </button>
      </div>

      {/* Task Form Modal (inline for simplicity) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6">
            <TaskForm
              onSubmit={handleSubmit}
              editingTask={editingTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Task sections */}
      {tasks.length === 0 ? (
        <div className="text-center font-[Poppins] font-medium text-xs text-[#EF4444] mt-20">
          <p>No tasks yet. Click "Add New Task" to get started.</p>
        </div>
      ) : (
        <>
          {categoryOrder.map(cat => (
            <CategorySection
              key={cat}
              title={cat}
              tasks={groupedTasks[cat]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </>
      )}

      {/* Back to Top button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={scrollToTop}
          className="bg-[#E5E7EB] font-[Poppins] font-medium hover:bg-[#D1D5DB] text-[#374151] px-5 py-2 rounded-full transition"
        >
           Back to Top
        </button>
      </div>
    </div>
  );
};