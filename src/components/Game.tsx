import React from 'react';
import { Flag, Users } from 'lucide-react';

interface GameProps {
  gameState: 'waiting' | 'playing' | 'finished';
  team: 'left' | 'right' | null;
  ropePosition: number;
  countdown: number | null;
  winner: 'left' | 'right' | null;
  onTeamSelect: (team: 'left' | 'right') => void;
  onPull: () => void;
}

const Game: React.FC<GameProps> = ({
  gameState,
  team,
  ropePosition,
  countdown,
  winner,
  onTeamSelect,
  onPull,
}) => {
  const isWaiting = gameState === 'waiting';
  const progressBarColor = isWaiting ? 'bg-yellow-300' : 'bg-green-300';

  const getWaitingMessage = () => {
    if (team === 'left') {
      return '等待右队玩家加入...';
    } else if (team === 'right') {
      return '等待左队玩家加入...';
    }
    return '等待玩家加入...';
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
      {gameState === 'waiting' && !team && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">选择你的队伍</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onTeamSelect('left')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Flag className="mr-2" /> 左队
            </button>
            <button
              onClick={() => onTeamSelect('right')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              右队 <Flag className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {team && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {gameState === 'waiting'
              ? getWaitingMessage()
              : gameState === 'playing'
              ? '拉！'
              : '游戏结束'}
          </h2>
          {countdown !== null && (
            <div className="text-4xl font-bold mb-4">
              游戏将在 {countdown} 秒后开始
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="text-red-500 mr-2" size={24} />
              <span className="font-bold">左队</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold">右队</span>
              <Users className="text-blue-500 ml-2" size={24} />
            </div>
          </div>
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`absolute top-0 left-0 h-full ${progressBarColor} transition-all duration-300 ease-in-out`}
              style={{ width: `${ropePosition}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full w-1 bg-black"
              style={{ left: `${ropePosition}%` }}
            ></div>
          </div>
          {gameState === 'playing' && (
            <button
              onClick={onPull}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded text-2xl"
            >
              拉！
            </button>
          )}
          {gameState === 'finished' && (
            <div className="text-2xl font-bold">
              {winner === team ? '你赢了！' : '你输了！'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;