import React, { useState } from 'react';

export default function TaskCard({ task, onToggleStatus, onDeleteTask, onUpdateTask, onOpenEditModal }) {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(task.title);
  const [inlineDescription, setInlineDescription] = useState(task.description);

  const handleSaveInline = () => {
    if (!inlineTitle.trim()) return;
    onUpdateTask(task.id, {
      title: inlineTitle.trim(),
      description: inlineDescription.trim(),
    });
    setIsEditingInline(false);
  };

  const handleCancelInline = () => {
    setInlineTitle(task.title);
    setInlineDescription(task.description);
    setIsEditingInline(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveInline();
    } else if (e.key === 'Escape') {
      handleCancelInline();
    }
  };

  // Helper to format due dates nicely
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  };

  // Determine priority classes
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge badge-priority-high';
      case 'Medium': return 'badge badge-priority-medium';
      case 'Low': return 'badge badge-priority-low';
      default: return 'badge badge-priority-medium';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleStatus(task.id)}
          />
          <span className="checkmark"></span>
        </label>

        <div className="task-title-group">
          {isEditingInline ? (
            <input
              type="text"
              value={inlineTitle}
              onChange={(e) => setInlineTitle(e.target.value)}
              className="inline-edit-input"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h3 className="task-title">{task.title}</h3>
          )}
        </div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isEditingInline ? (
          <textarea
            value={inlineDescription}
            onChange={(e) => setInlineDescription(e.target.value)}
            className="inline-edit-textarea"
            onKeyDown={handleKeyDown}
            placeholder="Description..."
          />
        ) : (
          task.description && <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-badges">
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority === 'High' ? '🔥' : task.priority === 'Medium' ? '⚡' : '✨'} {task.priority}
        </span>
        <span className="badge badge-tag">
          🏷️ {task.category}
        </span>
        {task.dueDate && (
          <span className="task-date-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="task-actions">
        {isEditingInline ? (
          <>
            <button 
              className="action-btn edit" 
              onClick={handleSaveInline} 
              title="Save Inline (Ctrl+Enter)"
              style={{ color: 'var(--priority-low)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button 
              className="action-btn delete" 
              onClick={handleCancelInline} 
              title="Cancel Inline (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </>
        ) : (
          <>
            <button 
              className="action-btn edit" 
              onClick={() => setIsEditingInline(true)} 
              title="Edit Inline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button 
              className="action-btn edit" 
              onClick={() => onOpenEditModal(task)} 
              title="Edit Full Details (Modal)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
            <button 
              className="action-btn delete" 
              onClick={() => onDeleteTask(task.id)} 
              title="Delete Task"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
