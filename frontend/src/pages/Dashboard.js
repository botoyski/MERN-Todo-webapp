import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarModern from '../components/NavbarModern';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import SummaryCard from '../components/SummaryCard';
import TaskModal from '../components/TaskModal';
import { Layout, List, Filter, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/tasks';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = () => {
    axios.get(API_URL)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
    axios.get(API_URL + '?archived=true')
      .then(res => setArchivedTasks(res.data))
      .catch(() => setArchivedTasks([]));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate stats
  const totalTasks = tasks.length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });


  // Create a new task
  const handleCreate = ({ title, description, priority, dueDate, dueTime }) => {
    axios.post(API_URL, {
      title,
      description,
      priority,
      status: 'Not Started',
      dueDate,
      dueTime
      // archived is intentionally omitted so it defaults to false
    })
    .then(() => fetchTasks())
    .catch(err => console.error(err));
  };

  // Update a task
  const handleUpdate = ({ title, description, priority, dueDate, dueTime }) => {
    if (!editTask) return;
    axios.patch(`${API_URL}/${editTask._id}`, {
      title,
      description,
      priority,
      dueDate,
      dueTime
    })
    .then(() => {
      fetchTasks();
      setEditTask(null);
      setIsModalOpen(false);
    })
    .catch(err => console.error(err));
  };

  // Archive (soft delete) a task
  const handleArchive = (id) => {
    axios.patch(`${API_URL}/${id}/archive`)
      .then(() => fetchTasks())
      .catch(err => console.error(err));
  };

  // Restore a task (move from archived to active)
  const handleRestore = (id) => {
    axios.patch(`${API_URL}/${id}`, { archived: false })
      .then(() => fetchTasks())
      .catch(err => console.error(err));
  };

  // Hard delete from archived
  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchTasks())
      .catch(err => console.error(err));
  };

  // Hard delete active task
  const handleDeleteActive = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchTasks())
      .catch(err => console.error(err));
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
  axios.patch(`${API_URL}/${id}`, {
    status: newStatus
  })
  .then(() => fetchTasks())
  .catch(err => console.error(err));
};

  const displayTasks = showArchived ? archivedTasks : filteredTasks;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFilterStatus={(val) => {
          setFilterPriority('All'); // reset priority filter

          if (val === 'Archived') {
            setShowArchived(true);
            setFilterStatus('All');
          } else {
            setShowArchived(false);
            setFilterStatus(val);
          }
        }}
        onFilterPriority={(val) => {
          setFilterPriority(val);
          setFilterStatus('All');
          setShowArchived(false);
        }}
        allCount={tasks.length}
        notStartedCount={tasks.filter(t => t.status === 'Not Started').length}
        inProgressCount={tasks.filter(t => t.status === 'In Progress').length}
        completedCount={tasks.filter(t => t.status === 'Completed').length}
        archivedCount={archivedTasks.length}
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

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
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
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onArchive={showArchived ? handleRestore : handleArchive}
                  onDelete={showArchived ? handleDelete : handleDeleteActive}
                  onStatusChange={handleStatusChange}
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