import React, { useState, useEffect } from 'react';

interface HistoryProps {
  username: string;
  onBack: () => void;
}

interface GameResult {
  id: number;
  result: 'win' | 'loss';
  difference: number;
  timestamp: string;
}

const History: React.FC<HistoryProps> = ({ username, onBack }) => {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/history/${username}`)
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error('获取历史记录时出错:', error));
  }, [username]);

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{username} 的游戏历史</h2>
      {history.length === 0 ? (
        <p>暂无游戏历史记录。</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">结果</th>
              <th className="text-left">差距</th>
              <th className="text-left">日期</th>
            </tr>
          </thead>
          <tbody>
            {history.map((game) => (
              <tr key={game.id}>
                <td className={game.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                  {game.result === 'win' ? '胜利' : '失败'}
                </td>
                <td>{game.difference.toFixed(2)}%</td>
                <td>{new Date(game.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={onBack}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        返回游戏
      </button>
    </div>
  );
};

export default History;