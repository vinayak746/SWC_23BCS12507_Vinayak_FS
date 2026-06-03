import React, { useState, useRef, useEffect } from 'react';

export default function TaskForm({ onAddTask }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const formRef = useRef(null);

  // Close form on click outside if fields are empty
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (!title && !description) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('Work');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <div 
      className={`quick-add-container ${isExpanded ? 'expanded' : ''}`} 
      ref={formRef}
    >
      {!isExpanded ? (
        <div className="quick-add-collapsed" onClick={() => setIsExpanded(true)}>
          <span className="quick-add-placeholder">Add a new task...</span>
          <span className="quick-add-plus">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="quick-add-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Take details or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="stat-label" style={{ fontSize: '0.75rem' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="select-field"
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="stat-label" style={{ fontSize: '0.75rem' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-field"
              >
                <option value="Work">💼 Work</option>
                <option value="Personal">🏡 Personal</option>
                <option value="Ideas">💡 Ideas</option>
                <option value="Studies">📚 Studies</option>
                <option value="Urgent">🔥 Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="stat-label" style={{ fontSize: '0.75rem' }}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => {
                setTitle('');
                setDescription('');
                setIsExpanded(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
