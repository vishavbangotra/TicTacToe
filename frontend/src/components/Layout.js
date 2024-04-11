import React, { useState, useEffect } from "react";
function Layout({ gameState, setGameState, socket }) {
  const [name, setName] = useState("");

  const joinRoom = () => {
    socket.emit("join");
    setGameState("Waiting");
  };


  const handleJoinClick = () => {
    const name = document.getElementById('nameInput').value
    setName(name);
    joinRoom();
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="description">
          <p>This games utilizes WebSockets to put two users in a same room for a tic tac toe match!</p>
          <div className="d-flex justify-content-center">
            {name === "" ? (
              <input
                type="text"
                className="form-control w-50 m-4"
                placeholder="Your Good Name..."
                id='nameInput'
              />
            ) : (
              <p>Just Name: {name}</p>
            )}
          </div>
          <div>
            {gameState === "Waiting" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn" type="button" style={{ background: "#e684ae", color: "white" }} disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Waiting...
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn" style={{ background: "#e684ae", color: "white" }} onClick={handleJoinClick}>
                  Join Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Layout;
