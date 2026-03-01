import { useState, useEffect } from 'react';
import NavbarModern from '../components/NavbarModern';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import SummaryCard from '../components/SummaryCard';
import TaskModal from '../components/TaskModal';
import { Layout, List, Filter, Search } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Default task data (used if no localStorage entry)
  const defaultTasks = [
    {
      id: 1,
      title: 'Design System Update',
      description: 'Update the color palette and typography scale for the new branding guidelines.',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Oct 24'
    },
    {
      id: 2,
      title: 'Client Meeting Prep',
      description: 'Prepare slides and demo environment for the quarterly review meeting with Acme Corp.',
      priority: 'Medium',
      status: 'Not Started',
      dueDate: 'Tomorrow'
    },
    {
      id: 3,
      title: 'Update Documentation',
      description: 'Review and update API documentation to reflect recent changes in endpoints.',
      priority: 'Low',
      status: 'Completed',
      dueDate: 'Oct 20'
    },
    {
      id: 4,
      title: 'Fix Login Bug',
      description: 'Resolve authentication issue on mobile devices.',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'Oct 22'
    },
    {
      id: 5,
      title: 'Database Optimization',
      description: 'Optimize database queries for better performance.',
      priority: 'Medium',
      status: 'Not Started',
      dueDate: 'Oct 28'
    }
  ];

  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : defaultTasks;
    } catch (e) {
      return defaultTasks;
    }
  });

  const [archivedTasks, setArchivedTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('archivedTasks');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showArchived, setShowArchived] = useState(false);

  // Calculate stats
  const totalTasks = tasks.length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleArchive = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTasks(tasks.filter(t => t.id !== id));
      setArchivedTasks([...archivedTasks, task]);
    }
  };

  const handleRestore = (id) => {
    const task = archivedTasks.find(t => t.id === id);
    if (task) {
      setArchivedTasks(archivedTasks.filter(t => t.id !== id));
      setTasks([...tasks, task]);
    }
  };

  const handleDelete = (id) => {
    // delete from archived (hard delete)
    setArchivedTasks(archivedTasks.filter(t => t.id !== id));
  };

  const handleDeleteActive = (id) => {
    // delete active task permanently
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleCreate = ({ title, description, priority, dueDate, dueTime }) => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      status: 'Not Started',
      dueDate,
      dueTime
    };
    setTasks([newTask, ...tasks]);
  };

  // persist tasks and archivedTasks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      // ignore storage errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
    } catch (e) {
      // ignore storage errors
    }
  }, [archivedTasks]);

  const handleUpdate = ({ title, description, priority, dueDate, dueTime }) => {
    if (!editTask) return;
    setTasks(tasks.map(t =>
      t.id === editTask.id ? { ...t, title, description, priority, dueDate, dueTime } : t
    ));
    setEditTask(null);
    setIsModalOpen(false);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const displayTasks = showArchived ? archivedTasks : filteredTasks;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFilterStatus={(val) => {
          setFilterStatus(val === 'All' ? 'All' : val);
          // if user selects Archived from sidebar, show archived view
          setShowArchived(val === 'Archived');
        }}
        onFilterPriority={(val) => {
          setFilterPriority(val === 'All' ? 'All' : val);
          // selecting a priority should show active tasks
          setShowArchived(false);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <NavbarModern 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearchChange={(e) => setSearchValue(e.target.value)}
          searchValue={searchValue}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto pt-16">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header with search and add button */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Manage your tasks and track progress.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <button                  onClick={() => setIsModalOpen(true)}                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  <span className="text-lg font-bold">+</span>
                  <span className="text-sm font-medium">New Task</span>
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard 
                icon="📊" 
                label="Total Tasks" 
                value={totalTasks}
                color="blue"
                trend={2}
              />
              <SummaryCard 
                icon="⭕" 
                label="Not Started" 
                value={notStarted}
                color="gray"
              />
              <SummaryCard 
                icon="⚡" 
                label="In Progress" 
                value={inProgress}
                color="orange"
              />
              <SummaryCard 
                icon="✅" 
                label="Completed" 
                value={completed}
                color="green"
              />
            </div>

            {/* Tasks Section Header */}
            <TaskModal
              isOpen={isModalOpen}
              onClose={() => { setIsModalOpen(false); setEditTask(null); }}
              onSubmit={editTask ? handleUpdate : handleCreate}
              initialData={editTask || {}}
              submitLabel={editTask ? 'Save Task' : 'Add Task'}
              heading={editTask ? 'Edit Task' : 'Add New Task'}
            />
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      showArchived 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {showArchived ? 'Archived' : 'Active'}
                  </button>
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Layout size={18} />
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Filter:</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['All', 'Not Started', 'In Progress', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>


            </div>

            {/* Tasks Grid/List */}
            {displayTasks.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {displayTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onArchive={showArchived ? handleRestore : handleArchive}
                    onDelete={showArchived ? handleDelete : handleDeleteActive}
                    isArchived={showArchived}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Try adjusting your filters or create a new task to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
