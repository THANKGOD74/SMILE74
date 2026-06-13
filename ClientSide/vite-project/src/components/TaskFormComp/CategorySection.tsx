import React from 'react';
import type { Task } from '../../types';
import TaskCard from './TaskCard';

interface CategorySection {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const CategorySection: React.FC<CategorySection> = ({
  title,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-10 w-full">
      <h2 className="mb-3 text-lg font-[Poppins] font-semibold text-[#134E4A] capitalize">
        {title} <span className="text-[#6B7280] font-normal text-sm">({tasks.length})</span>
      </h2>
      <div className="flex flex-col w-full border border-[#E5E7EB] divide-y divide-[#E5E7EB] rounded-none overflow-hidden">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;