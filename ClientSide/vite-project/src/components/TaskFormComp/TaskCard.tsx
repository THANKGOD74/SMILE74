import React from 'react';
import type { Task } from '../../types';
import deleteIcon from "../../assets/deleteIcon.png";
import clarity from '../../assets/clarity.png';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isOverdue = !task.completed && !!task.dueDate && new Date(task.dueDate) < new Date();

  // Category colors – keys are capitalized (for display), but we'll handle input case
  const categoryColors: Record<string, string> = {
    Urgent: 'bg-[#FEE2E2] text-[#B91C1C]',
    Important: 'bg-[#FFEDD5] text-[#c2410c]',
    Work: 'bg-[#CCFBF1] text-[#0F766E]',
    Personal: 'bg-[#FEF9C3] text-yellow-700',
  };

  // Capitalize first letter of category (e.g., "work" → "Work") for color lookup
  const categoryKey = task.category.charAt(0).toUpperCase() + task.category.slice(1);
  const badgeColor = categoryColors[categoryKey] || 'bg-gray-100 text-gray-700';

  return (
    <div className={`w-full px-6 py-5 transition-colors ${task.completed ? 'bg-[#F9FAFB] opacity-80' : 'bg-[#FFFFFF] hover:bg-[#FAFAFA]'}`}>
      {/* Top row: title (left) + action buttons (right) on the same line */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
        <h3 className={`font-[Poppins] font-semibold text-[#134E4A] text-lg leading-snug ${task.completed ? 'line-through text-[#6B7280]' : ''}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleComplete(task._id, !task.completed)}
            className="font-[Poppins] font-medium text-xs bg-[#F3F4F6] hover:bg-[#DCFCE7] px-3 py-1.5 rounded-none transition"
          >
            {task.completed ? 'Done' : 'Mark Done'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="bg-[#974FD0] hover:bg-[#7E3BB5] px-3 py-1.5 rounded-none flex flex-row justify-center items-center gap-1 transition"
          >
            <img className='w-3 h-3' src={clarity} alt="" />
            <p className='font-[Poppins] text-[#FFFFFF] text-xs'>Edit</p>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="bg-[#F3F4F6] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-none flex flex-row justify-center items-center gap-2 transition"
          >
            <img className='w-3 h-3' src={deleteIcon} alt="" />
            <p className='font-[Poppins] text-[#974FD0] text-xs'>Delete</p>
          </button>
        </div>
      </div>

      {/* Task details below the title/actions row */}
      <div className="flex flex-col gap-2">
        <span className={`w-fit text-xs px-3 py-1 rounded-none font-[Poppins] font-semibold ${badgeColor}`}>
          {categoryKey}
        </span>
        <p className="text-[#4B5563] font-[Poppins] text-sm">
          {task.description || 'No description'}
        </p>
        <p className="text-xs text-[#6B7280]">
          Due: {task.dueDate ? new Date(task.dueDate).toDateString() : 'No due date'}
          {isOverdue && <span className="text-[#EF4444] ml-2 font-[Poppins] font-semibold">(Overdue)</span>}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;