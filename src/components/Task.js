import React, { useState } from "react";
import { Draggable } from '@hello-pangea/dnd';

const Task = ({ task, index, onDelete, onToggleComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({
    title: task.title,
    description: task.description || '',
    tags: task.tags || []
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.title.trim()) {
      onEdit({
        ...task,
        ...taskData
      });
      setIsEditing(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData({
        ...taskData,
        tags: [...taskData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskData({
      ...taskData,
      tags: taskData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task ${snapshot.isDragging ? "dragging" : ""}`}
        >
          {isEditing ? (
            <form onSubmit={handleSubmit} className="task-edit-form">
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                placeholder="Task title"
                className="task-title-input"
                autoFocus
              />
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="Task description"
                className="task-description-input"
              />
              <div className="task-tags">
                {taskData.tags.map(tag => (
                  <span key={tag} className="task-tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="remove-tag-button"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="add-tag-container">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="tag-input"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="add-tag-button"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="task-edit-actions">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={`task-content ${task.completed ? "completed" : ""}`}>
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={onToggleComplete}
                  className="task-checkbox"
                />
                <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </h3>
                <div className="task-actions">
                  <button className="task-edit-button" onClick={() => setIsEditing(true)} title="Edit task">
                    ✎ Edit
                  </button>
                  <button className="task-delete-button" onClick={onDelete} title="Delete task">
                    × Delete
                  </button>
                </div>
              </div>
              {task.description && (
                <p className={`task-description ${task.completed ? 'completed' : ''}`}>
                  {task.description}
                </p>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="task-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
