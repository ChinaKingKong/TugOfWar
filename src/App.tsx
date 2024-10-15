import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Login from './components/Login';
import Game from './components/Game';
import History from './components/History';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [team, setTeam] = useState<'left' | 'right' | null>(null);
  const [ropePosition, setRopePosition] = useState<number>(50);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('gameState', (state: any) => {
      setGameState(state.status);
      setRopePosition(state.ropePosition);
      setCountdown(state.countdown);
      if (state.status === 'finished') {
        setWinner(state.winner);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    if (socket) {
      socket.emit('login', name);
    }
  };

  const handleTeamSelect = (selectedTeam: 'left' | 'right') => {
    setTeam(selectedTeam);
    if (socket) {
      socket.emit('joinTeam', selectedTeam);
    }
  };

  const handlePull = () => {
    if (socket && gameState === 'playing') {
      socket.emit('pull', team);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">拔河比赛</h1>
      {showHistory ? (
        <History username={username} onBack={toggleHistory} />
      ) : (
        <Game
          gameState={gameState}
          team={team}
          ropePosition={ropePosition}
          countdown={countdown}
          winner={winner}
          onTeamSelect={handleTeamSelect}
          onPull={handlePull}
        />
      )}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={toggleHistory}
      >
        {showHistory ? '返回游戏' : '查看历史'}
      </button>
    </div>
  );
};

export default App;