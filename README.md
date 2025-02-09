# 拔河游戏

这是一个使用React、Node.js和Socket.IO构建的实时多人拔河游戏。玩家可以加入队伍并参与虚拟拔河比赛。

## 功能

- 实时多人游戏
- 队伍选择（左队或右队）
- 实时绳子位置更新
- 游戏历史记录跟踪
- 用户认证（仅用户名）

## 前置条件

在开始之前，请确保您已安装以下内容：
- Node.js（v14或更高版本）
- npm（通常随Node.js一起安装）

## 设置

1. 克隆仓库：
   ```
   git clone <仓库地址>
   cd tug-of-war-game
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 创建SQLite数据库：
   服务器首次运行时会自动创建数据库文件（`tugofwar.db`）。

## 运行应用

1. 启动服务器：
   ```
   npm run server
   ```
   这将在 http://localhost:3001 启动后端服务器。

2. 在新的终端中，启动前端开发服务器：
   ```
   npm run dev
   ```
   这将启动Vite开发服务器，通常在 http://localhost:5173 。

3. 在浏览器中打开 http://localhost:5173 即可开始游戏。

## 游戏玩法

1. 输入用户名登录。
2. 选择一个队伍（左队或右队）。
3. 等待至少一名玩家加入对方队伍。
4. 游戏开始后，快速点击"拉！"按钮，将绳子向自己这边移动。
5. 游戏持续30秒。将绳子拉到自己这边最远的队伍获胜。
6. 游戏结束后，可以点击"查看历史"按钮查看您的游戏历史记录。

## 开发

- 前端代码位于 `src` 目录中。
- 后端服务器代码在 `server.js` 中。
- 要进行更改，请编辑相关文件，开发服务器将自动重新加载。

## 部署

部署时，您需要：
1. 构建前端：
   ```
   npm run build
   ```
2. 在生产环境中提供构建文件并运行服务器。

注意：确保更新 `server.js` 中的CORS设置以匹配您的生产域名。
