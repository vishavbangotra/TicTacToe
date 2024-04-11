import React, { useEffect, useState } from "react";
import "./Room.css";

const Room = ({ socket }) => {
  const [gameMatrix, setGameMatrix] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState(false);
  const [marker, setMarker] = useState("0");

  function checkTicTacToeWin(board) {
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][0] !== "")
            return true;
    }

    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col] !== "")
            return true;
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "")
        return true;

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== "")
        return true;

    return false;
}

  useEffect(() => {
    socket.on("turn", (val) => {
      setTurn(val);
      if (val) setMarker("X");
    });
    socket.on("move_back", (object) => {
      setTurn(true);
      updateMatrix(object.x, object.y, object.m);
    });

    return () => {
      socket.off("turn");
      socket.off("move_back");
    };
  }, [socket]);

  const updateMatrix = (x, y, m) => {
    setGameMatrix((prevMatrix) => {
      const newGameMatrix = [...prevMatrix];
      newGameMatrix[x][y] = m;
      return newGameMatrix;
    });
  };

  const handleMove = (event) => {
    if (turn) {
      const blockId = event.target.getAttribute("data-id");
      const [x, y] = [parseInt(blockId[0]), parseInt(blockId[1])];
      if (gameMatrix[x][y] === "") {
        setGameMatrix((prevMatrix) => {
          const newGameMatrix = [...prevMatrix];
          newGameMatrix[x][y] = marker;
          return newGameMatrix;
        });
        socket.emit("move", { x: x, y: y, m: marker });
        setTurn(false);
      }
      if (checkTicTacToeWin(gameMatrix) != null){
        socket.emit("win");
      }
    }
  };

  return (
    <>
      <p>{turn ? "Your Turn" : "His Turn"}</p>
      <div className="board" onClick={handleMove}>
        {gameMatrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="block"
              data-id={`${rowIndex}${colIndex}`}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Room;