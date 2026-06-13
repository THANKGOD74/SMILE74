import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTasks, updateTask } from '../services/api';
import type { Task } from '../types';

export const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        setError('No task ID provided');
        setLoading(false);
        return;
      }
      try {
        const tasks = await fetchTasks();
        const found = tasks.find(t => t._id === id);
        if (found) {
          setTask(found);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!task) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setTask({
      ...task,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryToggle = (category: Task['category']) => {
    if (!task) return;
    setTask({ ...task, category });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    if (!task.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        category: task.category,
        completed: task.completed,
      });
      navigate('/my-tasks');
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //  Define categories 
  const categories: Task['category'][] = ['Urgent', 'Important', 'Work', 'Personal'];

  if (loading) {
    return (
      <div className="flex justify-center items-center font-[Poppins] font-medium h-screen">
        <p className='font-[Poppins] font-medium text-xl  text-[#115E59] '>Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-[#EF4444] font-[Poppins] font-medium mb-4">{error || 'Task not found'}</p>
        <button
          onClick={() => navigate('/my-tasks')}
          className="bg-[#0D9488] font-[Poppins] font-medium text-[#FFFFFF] px-4 py-2 rounded-full"
        >
          Back to My Tasks
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/my-tasks')}
          className="text-[#0D9488] font-[Poppins] font-medium hover:text-[#115E59] flex items-center gap-1"
        >
           Back
        </button>
        <h1 className="text-3xl font-[Poppins] font-bold text-[#134e4a]">Edit Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FFFFFF] p-6 rounded-2xl shadow-md">
        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            required
          />
        </div>

        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={task.description || ''}
            onChange={handleChange}
            rows={6}
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
          />
        </div>

        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate ? task.dueDate.split('T')[0] : ''}
            onChange={handleChange}
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            required
          />
        </div>

        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Tags (Category)</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className={`px-4 py-2 rounded-full border transition ${
                  task.category === cat
                    ? 'bg-[#0D9488] text-[#FFFFFF] border-[#0D9488]'
                    : 'bg-[#ffffff] text-[#374151] border-[#D1D5DB] hover:border-[#2DD4BF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="w-5 h-5 text-[#0D9488] rounded focus:ring-[#2DD4BF]"
          />
          <span className="text-[#374151] font-[Poppins] font-medium">Done (Mark as completed)</span>
        </label>

        {error && <p className="text-[#EF4444] font-[Poppins] font-medium text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-[#ffffff] font-[Poppins] font-semibold py-3 rounded-full transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="flex justify-center mt-10">
        <button
          onClick={scrollToTop}
          className="bg-[#e5e7eb] hover:bg-[#D1D5DB] text-[#374151] font-[Poppins] font-semibold px-5 py-2 rounded-full transition"
        >
           Back to Top
        </button>
      </div>
    </div>
    </>
  );
};