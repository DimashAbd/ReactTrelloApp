import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(() => {
    const savedBoard = localStorage.getItem(`board-${boardId}`);
    return savedBoard ? JSON.parse(savedBoard) : { id: boardId, name: "", columns: [] };
  });

  useEffect(() => {
    localStorage.setItem(`board-${boardId}`, JSON.stringify(board));
  }, [board, boardId]);

  const updateBoardData = (updatedBoardData) => {
    setBoard(updatedBoardData);
  };

  return (
    <div className="board-page">
      <h2>{board.name}</h2>
      <Board
        boardId={boardId}
        boardData={board}
        updateBoardData={updateBoardData}
      />
    </div>
  );
};

export default BoardPage;
