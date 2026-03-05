import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Sidebar = ({
  isOpen,
  onClose,
  onFilterStatus,
  onFilterPriority,
  allCount = 0,
  notStartedCount = 0,
  inProgressCount = 0,
  completedCount = 0,
  archivedCount = 0
}) => {
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    priority: true,
    projects: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-16
        overflow-y-auto
        shadow-lg lg:shadow-none
      `}>
        <div className="p-6">

          {/* Task Status Section */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('status')}
              className="flex items-center justify-between w-full mb-4 px-2"
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Task Status</h4>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expandedSections.status ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.status && (
              <nav className="space-y-2">
                <button onClick={() => onFilterStatus && onFilterStatus('All')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-blue-50 active:text-blue-600 font-medium">
                  <span className="text-lg">📋</span>
                  <span className="text-sm">All Tasks</span>
                  <span className="ml-auto text-xs text-gray-400">{allCount}</span>
                </button>
                <button onClick={() => onFilterStatus && onFilterStatus('Not Started')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">⭕</span>
                  <span className="text-sm">Not Started</span>
                  <span className="ml-auto text-xs text-gray-400">{notStartedCount}</span>
                </button>
                <button onClick={() => onFilterStatus && onFilterStatus('In Progress')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">⚡</span>
                  <span className="text-sm">In Progress</span>
                  <span className="ml-auto text-xs text-gray-400">{inProgressCount}</span>
                </button>
                <button onClick={() => onFilterStatus && onFilterStatus('Completed')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">✅</span>
                  <span className="text-sm">Completed</span>
                  <span className="ml-auto text-xs text-gray-400">{completedCount}</span>
                </button>
                <button onClick={() => onFilterStatus && onFilterStatus('Archived')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">📦</span>
                  <span className="text-sm">Archived</span>
                  <span className="ml-auto text-xs text-gray-400">{archivedCount}</span>
                </button>
              </nav>
            )}
          </div>

          {/* Priority Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <button
              onClick={() => toggleSection('priority')}
              className="flex items-center justify-between w-full mb-4 px-2"
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Priority</h4>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expandedSections.priority ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.priority && (
              <nav className="space-y-2">
                <button onClick={() => onFilterPriority && onFilterPriority('High')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-sm">High Priority</span>
                </button>
                <button onClick={() => onFilterPriority && onFilterPriority('Medium')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="text-sm">Medium Priority</span>
                </button>
                <button onClick={() => onFilterPriority && onFilterPriority('Low')} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-sm">Low Priority</span>
                </button>
              </nav>
            )}
          </div>

          {/* Projects Section */}
          <div>
            <button
              onClick={() => toggleSection('projects')}
              className="flex items-center justify-between w-full mb-4 px-2"
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Projects</h4>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expandedSections.projects ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.projects && (
              <nav className="space-y-2">
                <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">🌐</span>
                  <span className="text-sm">Website Redesign</span>
                </button>
                <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">📱</span>
                  <span className="text-sm">Mobile App</span>
                </button>
                <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  <span className="text-lg">📈</span>
                  <span className="text-sm">Marketing Q3</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
