Titan's Circuit
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Titan's Circuit</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="board-container">
    <div id="board">
      <!-- 18 Nodes -->
      ${Array.from({ length: 18 }, (_, i) => `
        <div class="node" data-id="${i}"></div>
      `).join('')}

      <!-- Edges (hardcoded visually for layout) will be added dynamically via JS -->
    </div>
  </div>
  <script src="board.js" type="module"></script>
</body>
</html>
<div id="ui">
  <div>Red Score: <span id="red-score">0</span></div>
  <div>Blue Score: <span id="blue-score">0</span></div>
  <div>Turn: <span id="turn-display">Red</span></div>
  <div>Turn Timer: <span id="turn-timer">10</span>s</div>
  <div>Game Timer: <span id="game-timer">60</span>s</div>
</div>
