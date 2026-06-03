import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

const DEFAULT_TASKS = [
  {
    id: 'default-1',
    title: '🚀 Complete Task 1 Coding Requirements',
    description: 'Build a lightweight task management app with React, including Add, Edit (inline/modal), Delete, and Toggle status features.',
    priority: 'High',
    category: 'Work',
    dueDate: '2026-06-05',
    completed: false,
    dateCreated: Date.now() - 3600000 * 2, // 2 hours ago
  },
  {
    id: 'default-2',
    title: '📚 Read React Compiler Docs',
    description: 'Look into the new automatic memoization feature and learn how it improves rendering performance.',
    priority: 'Medium',
    category: 'Studies',
    dueDate: '2026-06-08',
    completed: false,
    dateCreated: Date.now() - 3600000 * 24, // 1 day ago
  },
  {
    id: 'default-3',
    title: '💡 Ideate Premium UI Designs',
    description: 'Brainstorm modern glassmorphism web design ideas with rich gradients and hover scale effects.',
    priority: 'Low',
    category: 'Ideas',
    dueDate: '2026-06-12',
    completed: true,
    dateCreated: Date.now() - 3600000 * 48, // 2 days ago
  }
];

export default function App() {
  // State management
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('task-manager-tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('dateCreated'); // dateCreated, dueDate, priority
  
  // Theme state
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('task-manager-theme');
    return savedTheme === 'light';
  });

  // Modal editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Sync tasks with localStorage
  useEffect(() => {
    localStorage.setItem('task-manager-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync theme with body class and localStorage
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('task-manager-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('task-manager-theme', 'dark');
    }
  }, [isLightTheme]);

  // Task manipulation functions
  const handleAddTask = (newTaskData) => {
    const newTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
      dateCreated: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleUpdateTask = (taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter & Sort Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'active' && !task.completed) ||
      (filterTab === 'completed' && task.completed);

    return matchesSearch && matchesTab;
  });

  const priorityWeight = { High: 3, Medium: 2, Low: 1 };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return b.dateCreated - a.dateCreated;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <h1 className="brand-title">FlowTask</h1>
        </div>
        <button 
          onClick={() => setIsLightTheme(!isLightTheme)} 
          className="theme-toggle-btn"
          title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label="Toggle theme"
        >
          {isLightTheme ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Dashboard Statistics */}
      <section className="stats-grid" aria-label="Dashboard statistics">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{totalTasks}</span>
        </div>
        <div className="stat-card stat-active">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeTasks}</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedTasks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{completionRate}%</span>
          <div className="progress-container" aria-hidden="true">
            <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </section>

      {/* Quick Add Form */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Toolbar Controls */}
      <section className="toolbar-container" aria-label="Filtering and sorting options">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            All Tasks
          </button>
          <button 
            className={`filter-tab ${filterTab === 'active' ? 'active' : ''}`}
            onClick={() => setFilterTab('active')}
          >
            Active
          </button>
          <button 
            className={`filter-tab ${filterTab === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="search-sort-group">
          <div className="search-wrapper">
            <svg 
              className="search-icon" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort tasks by"
          >
            <option value="dateCreated">📅 Date Created</option>
            <option value="dueDate">⏳ Due Date</option>
            <option value="priority">🔥 Priority</option>
          </select>
        </div>
      </section>

      {/* Tasks Display */}
      <main>
        {sortedTasks.length > 0 ? (
          <div className="tasks-grid">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
                onOpenEditModal={handleOpenEditModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h2 className="empty-state-title">No Tasks Found</h2>
            <p className="empty-state-desc">
              {searchTerm 
                ? "We couldn't find any tasks matching your search." 
                : filterTab === 'completed' 
                  ? "You haven't completed any tasks yet. Keep going!" 
                  : "Enjoy your free time! Or add a new task to get started."}
            </p>
          </div>
        )}
      </main>

      {/* Edit Details Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
