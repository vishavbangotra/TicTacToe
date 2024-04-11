import './App.css';
import React, { useState, useEffect } from 'react';
// import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Room from './components/Room'
import io from 'socket.io-client';
const socket = io('http://localhost:8080');

export default function App() {
  const [gameState, setGameState] = useState("Idle")
  
  useEffect(() => {
    socket.on('roomJoined', () => {
      setGameState("Ingame");
    });
    socket.on('disconnect', () => {
      setGameState("Idle");
    });
    socket.on('leave', () => {
      setGameState("Idle");
      return () => {
        socket.off('roomJoined');
        socket.off('disconnect');
      };
    });
    return () => {
      socket.off('roomJoined');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <header className="App-header">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
      </header>
      <div className="page">
          <div className="container">
          <h3 className="mainHeader">शून्य & एक्स for LB India</h3>
            { gameState === "Ingame" ? <Room socket={socket} /> : <Layout gameState={gameState} setGameState={setGameState} socket={socket}/>}
          </div>
    </div>
    </div>
    );
  
}
