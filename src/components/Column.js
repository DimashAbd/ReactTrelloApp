import React, { useState } from "react";
import Task from "./Task";
import { Droppable, Draggable } from '@hello-pangea/dnd';

const Column = ({ column, index, onAddTask, onDeleteTask, onToggleComplete, onEditColumn, onDeleteColumn, onEditTask }) => {
  const [taskName, setTaskName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask(column.id, taskName);
      setTaskName("");
      setIsAddingTask(false);
    }
  };

  const handleNameChange = (e) => {
    setColumnName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    onEditColumn(column.id, columnName);
    setIsEditingName(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="column"
        >
          <div className="column-header" {...provided.dragHandleProps}>
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="column-name-form">
                <input
                  type="text"
                  value={columnName}
                  onChange={handleNameChange}
                  onBlur={handleNameSubmit}
                  autoFocus
                  className="column-name-input"
                />
              </form>
            ) : (
              <div className="column-title-container">
                <h3 className="column-title" onClick={() => setIsEditingName(true)}>
                  {column.name}
                </h3>
                <button
                  className="delete-column-button"
                  onClick={() => onDeleteColumn(column.id)}
                  title="Delete column"
                >
                  ×
                </button>
              </div>
            )}
            <span className="task-count">{column.tasks.length}</span>
          </div>
          
          <Droppable droppableId={column.id} type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="tasks-container"
              >
                {column.tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    onDelete={() => onDeleteTask(column.id, task.id)}
                    onToggleComplete={() => onToggleComplete(column.id, task.id)}
                    onEdit={(updatedTask) => onEditTask(column.id, updatedTask)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {isAddingTask ? (
            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task title..."
                autoFocus
              />
              <div className="add-task-actions">
                <button type="submit" className="add-task-button">
                  Add Task
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsAddingTask(false);
                    setTaskName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              className="add-task-button"
              onClick={() => setIsAddingTask(true)}
            >
              + Add Task
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Column;
