import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css';

const HomePage = () => {
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("boards");
    return saved ? JSON.parse(saved) : [];
  });
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  const addBoard = () => {
    if (newBoardName.trim()) {
      const newBoardId = Date.now().toString();
      const newBoard = {
        id: newBoardId,
        name: newBoardName,
      };
      
      // Initialize the board's columns in localStorage
      const initialColumns = {
        "todo": { id: "todo", name: "To Do", tasks: [] },
        "in-progress": { id: "in-progress", name: "In Progress", tasks: [] },
        "done": { id: "done", name: "Done", tasks: [] }
      };
      
      localStorage.setItem(`board-${newBoardId}`, JSON.stringify(initialColumns));
      localStorage.setItem(`board-name-${newBoardId}`, newBoardName);
      
      setBoards([...boards, newBoard]);
      setNewBoardName("");
      navigate(`/board/${newBoardId}`);
    }
  };

  const deleteBoard = (boardId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete button
    if (window.confirm("Are you sure you want to delete this board?")) {
      // Remove board data from localStorage
      localStorage.removeItem(`board-${boardId}`);
      localStorage.removeItem(`board-name-${boardId}`);
      
      // Remove board from the list
      setBoards(boards.filter(board => board.id !== boardId));
    }
  };

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  return (
    <div className="home-page">
      <h1>My Boards</h1>
      <div className="board-creation">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter board name..."
          className="board-name-input"
          onKeyPress={(e) => e.key === 'Enter' && addBoard()}
        />
        <button onClick={addBoard} className="create-board-button">
          Create Board
        </button>
      </div>

      <div className="boards-grid">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board-card"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <div className="board-card-header">
              <h3>{board.name}</h3>
              <button 
                className="delete-board-button"
                onClick={(e) => deleteBoard(board.id, e)}
                title="Delete board"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
