import React, { useEffect, useState } from 'react';
import type { Task, TaskInput } from '../../types';

interface TaskFormProps {
  onSubmit: (task: TaskInput) => void;
  editingTask: Task | null;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, editingTask, onCancel }) => {
  const [form, setForm] = useState<TaskInput>({
    title: '',
    description: '',
    dueDate: '',
    category: 'Personal',
    completed: false,
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        category: editingTask.category,
        completed: editingTask.completed,
      });
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        category: 'Personal',
        completed: false,
      });
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    // Send every edited field; omit dueDate when empty so the backend
    // doesn't try to cast '' to a Date (which would fail and skip the update).
    onSubmit({ ...form, dueDate: form.dueDate || undefined });
    if (!editingTask) {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        category: 'Personal',
        completed: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 mb-8 shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-teal-900">
        {editingTask ? 'Edit Task' : 'New Task'}
      </h3>
      <input
        type="text"
        placeholder="Title *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
        rows={3}
      />
      <input
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        required
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value as any })}
        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <option value="Urgent">Urgent</option>
        <option value="Important">Important</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.completed}
          onChange={(e) => setForm({ ...form, completed: e.target.checked })}
          className="w-4 h-4"
        />
        <span>Completed</span>
      </label>
      <div className="flex gap-3">
        <button type="submit" className="bg-teal-800 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition">
          {editingTask ? 'Update' : 'Create'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-5 py-2 rounded-full hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;