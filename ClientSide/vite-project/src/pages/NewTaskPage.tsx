import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api';
import type { TaskInput } from '../types';

interface NewTaskPageProps {
  onTaskCreated?: () => void;
}

export const NewTaskPage: React.FC<NewTaskPageProps> = ({ onTaskCreated }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState<Omit<TaskInput, '_id'>>({
    title: '',
    description: '',
    category: 'Personal',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySelect = (category: TaskInput['category']) => {
    setForm(prev => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!form.dueDate) {
      setError('Due date is required');
      return;
    }
    if (form.dueDate < today) {
      setError('Due date cannot be in the past');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTask(form as TaskInput);
      setForm({
        title: '',
        description: '',
        category: 'Personal',
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
      });
      onTaskCreated?.();
      navigate('/my-tasks');
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories: TaskInput['category'][] = ['Work', 'Personal', 'Urgent', 'Important'];

  return (
    <>
    <div className="max-w-2xl mx-auto px-4 py-8 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-4xl font-[Poppins] font-bold text-[#134E4A] mb-2">New Task</h1>
      <p className="text-[#6B7280] font-[Poppins] font-medium mb-8">Create a new task to stay organized</p>

      <form onSubmit={handleSubmit} className="space-y-6 [#FFFFFF] p-6 rounded-2xl shadow-md">
        {/* Task Title */}
        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="E.g. Project Defense, Assignment ..."
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Briefly describe your task..."
            rows={4}
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D5BE]"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            min={today}
            onChange={handleChange}
            className="w-full p-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            required
          />
        </div>

        {/* Tags / Category */}
        <div>
          <label className="block text-[#374151] font-[Poppins] font-semibold mb-2">Tags (Category)</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full border transition ${
                  form.category === cat
                    ? 'bg-[#009689] text-[#FFFFFF] border-[#0D9488]'
                    : 'bg-[#FFFFFF] text-[#374151] border-[#D1D5DB] hover:border-[#2DD4BF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Done checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
            className="w-5 h-5 text-[#0D9488] rounded focus:ring-[#2DD4BF]"
          />
          <span className="text-gray-700 font-[Poppins] font-medium">Done (Mark as completed)</span>
        </label>

        {error && <p className="text-[#EF4444] font-[Poppins] font-medium text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-[#FFFFFF] font-[Poppins] font-semibold py-3 rounded-full transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>

      {/* Back to Top */}
      <div className="flex justify-center mt-10">
        <button
          onClick={scrollToTop}
          className="bg-gray-200 hover:bg-[#D1D5DB] text-[#374151] font-[Poppins] font-medium px-5 py-2 rounded-full transition"
        >
           Back to Top
        </button>
      </div>
    </div>
    </>
  );
};