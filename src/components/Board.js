import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from './Column';
import '../styles.css';

export default function Board() {
  const { boardId } = useParams();
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(`board-${boardId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with default columns if no saved data exists
    return {
      "todo": { id: "todo", name: "To Do", tasks: [] },
      "in-progress": { id: "in-progress", name: "In Progress", tasks: [] },
      "done": { id: "done", name: "Done", tasks: [] }
    };
  });
  const [boardName, setBoardName] = useState(() => {
    const saved = localStorage.getItem(`board-name-${boardId}`);
    return saved || "New Board";
  });
  const [isEditingName, setIsEditingName] = useState(false);

  // Save columns and board name to localStorage when updated
  useEffect(() => {
    if (Object.keys(columns).length > 0) {
      localStorage.setItem(`board-${boardId}`, JSON.stringify(columns));
    }
    localStorage.setItem(`board-name-${boardId}`, boardName);
  }, [columns, boardId, boardName]);

  // Handle drag end event (either columns or tasks)
  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    // If there's no destination or if the item was dropped in the same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    // If dragging columns
    if (type === "column") {
      const columnsArray = Object.entries(columns);
      const [removed] = columnsArray.splice(source.index, 1);
      columnsArray.splice(destination.index, 0, removed);
      setColumns(Object.fromEntries(columnsArray));
    } else {
      // If dragging tasks
      const startColumn = columns[source.droppableId];
      const endColumn = columns[destination.droppableId];

      if (startColumn === endColumn) {
        // Reorder tasks within the same column
        const newTasks = [...startColumn.tasks];
        const [movedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, movedTask);
        setColumns({
          ...columns,
          [startColumn.id]: { ...startColumn, tasks: newTasks },
        });
      } else {
        // Move task to another column
        const startTasks = [...startColumn.tasks];
        const endTasks = [...endColumn.tasks];
        const [movedTask] = startTasks.splice(source.index, 1);
        endTasks.splice(destination.index, 0, movedTask);
        setColumns({
          ...columns,
          [startColumn.id]: { ...startColumn, tasks: startTasks },
          [endColumn.id]: { ...endColumn, tasks: endTasks },
        });
      }
    }
  };

  // Add new column
  const addColumn = () => {
    const newId = Date.now().toString();
    setColumns({
      ...columns,
      [newId]: { id: newId, name: "New Column", tasks: [] },
    });
  };

  // Add a task to a column
  const addTask = (colId, taskTitle) => {
    const task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: '',
      tags: [],
      completed: false
    };
    const updatedCol = { ...columns[colId] };
    updatedCol.tasks.push(task);
    setColumns({ ...columns, [colId]: updatedCol });
  };

  // Delete a task from a column
  const deleteTask = (colId, taskId) => {
    const updatedTasks = columns[colId].tasks.filter((task) => task.id !== taskId);
    setColumns({
      ...columns,
      [colId]: { ...columns[colId], tasks: updatedTasks },
    });
  };

  // Toggle task completion
  const toggleComplete = (colId, taskId) => {
    const updatedTasks = columns[colId].tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setColumns({
      ...columns,
      [colId]: { ...columns[colId], tasks: updatedTasks },
    });
  };

  const handleNameChange = (e) => {
    setBoardName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  // Edit column name
  const editColumn = (columnId, newName) => {
    if (newName.trim()) {
      setColumns({
        ...columns,
        [columnId]: { ...columns[columnId], name: newName }
      });
    }
  };

  // Delete column
  const deleteColumn = (columnId) => {
    if (window.confirm("Are you sure you want to delete this column and all its tasks?")) {
      const newColumns = { ...columns };
      delete newColumns[columnId];
      setColumns(newColumns);
    }
  };

  // Edit a task
  const editTask = (columnId, updatedTask) => {
    const updatedTasks = columns[columnId].tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setColumns({
      ...columns,
      [columnId]: { ...columns[columnId], tasks: updatedTasks },
    });
  };

  return (
    <div className="app-container">
      <header className="board-header">
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="board-name-form">
            <input
              type="text"
              value={boardName}
              onChange={handleNameChange}
              onBlur={handleNameSubmit}
              autoFocus
              className="board-name-input"
            />
          </form>
        ) : (
          <h1 className="board-title" onClick={() => setIsEditingName(true)}>
            {boardName}
          </h1>
        )}
        <div className="board-actions">
          <button className="add-column-button" onClick={addColumn}>
            Add Column
          </button>
        </div>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="board"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {Object.values(columns).map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  index={index}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onToggleComplete={toggleComplete}
                  onEditColumn={editColumn}
                  onDeleteColumn={deleteColumn}
                  onEditTask={editTask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
