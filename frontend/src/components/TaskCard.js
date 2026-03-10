import { MoreVertical, Trash2, Archive } from 'lucide-react';
import { useState } from 'react';

const TaskCard = ({ task, onEdit, onArchive, onDelete, onStatusChange, isArchived = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    High: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
    Low: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' }
  };

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Completed': 'bg-green-100 text-green-700'
  };

  const statuses = ['Not Started', 'In Progress', 'Completed'];

  const priorityColor = priorityColors[task.priority] || priorityColors.Low;

  return (
    <div className={`p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${priorityColor.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="relative ml-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onArchive(task._id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Archive size={14} /> {isArchived ? 'Restore' : 'Archive'}
              </button>
              <button
                onClick={() => {
                  onDelete(task._id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200/50">
        {/* Priority Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor.badge}`}>
          {task.priority}
        </span>

        {/* Status Badge */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-none outline-none ${statusColors[task.status]}`}
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Due Date and Time */}
        <div className="flex items-center gap-1 text-xs text-gray-600 ml-auto">
          📅 {task.dueDate} {task.dueTime && `at ${task.dueTime}`}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;