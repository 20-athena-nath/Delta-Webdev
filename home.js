const nodePositions = [
  [300, 50],   [420, 115], [420, 250],
  [300, 320],  [180, 250], [180, 115],
  [300, 120],  [370, 155], [370, 230],
  [300, 265],  [230, 230], [230, 155],
  [300, 180],  [330, 195], [320, 225],
  [300, 240],  [280, 225], [270, 195]
]

// Create node positions
document.querySelectorAll('.node').forEach((node, i) => {
  const [x, y] = nodePositions[i]
  node.style.left = `${x}px`
  node.style.top = `${y}px`
})

// Edge list: [from, to, weight]
const edges = [
  [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1],
  [0, 6, 2], [1, 7, 2], [2, 8, 2], [3, 9, 2], [4, 10, 2], [5, 11, 2],
  [6, 7, 1], [7, 8, 6], [8, 9, 1], [9, 10, 6], [10, 11, 1], [11, 6, 1],
  [6, 12, 5], [7, 13, 4], [8, 14, 5],
  [9, 15, 4], [10, 16, 5], [11, 17, 4],
  [12, 13, 8], [13, 14, 9], [14, 15, 8],
  [15, 16, 9], [16, 17, 8], [17, 12, 8],
]

// Draw edges as divs
const board = document.getElementById('board')

edges.forEach(([from, to, weight]) => {
  const [x1, y1] = nodePositions[from]
  const [x2, y2] = nodePositions[to]

  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI

  const edge = document.createElement('div')
  edge.className = 'edge'
  edge.dataset.weight = weight
  edge.style.width = `${length}px`
  edge.style.left = `${x1 + 10}px`  // +10 to offset from center
  edge.style.top = `${y1 + 10}px`
  edge.style.transform = `rotate(${angle}deg)`

  board.appendChild(edge)
})
let currentPlayer = 'red'
let placedTitans = { red: 0, blue: 0 }
const maxTitansPerPlayer = 4
let phase = 'placement'

const playerColors = { red: '#e53935', blue: '#2196f3' }

// Add click listeners to place titans
document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', () => {
    const id = +node.dataset.id
    if (phase !== 'placement') return
    if (node.dataset.owner) return
    if (id > 5) return // Only outer ring (node 0–5)

    node.style.backgroundColor = playerColors[currentPlayer]
    node.dataset.owner = currentPlayer

    placedTitans[currentPlayer]++

    // Update score after placement (some edges may be formed)
    updateScore()

    if (placedTitans[currentPlayer] === maxTitansPerPlayer) {
      currentPlayer = currentPlayer === 'red' ? 'blue' : 'red'
    }

    if (placedTitans.red === 4 && placedTitans.blue === 4) {
      phase = 'movement'
      console.log('%c>>> Movement Phase Begins <<<', 'color: yellow')
    } else {
      console.log(`Turn: ${currentPlayer.toUpperCase()}`)
    }
  })
})
let turnSeconds = 10
let gameSeconds = 60

const turnTimerSpan = document.getElementById('turn-timer')
const gameTimerSpan = document.getElementById('game-timer')
const turnDisplay = document.getElementById('turn-display')

function switchTurn() {
  currentPlayer = currentPlayer === 'red' ? 'blue' : 'red'
  turnSeconds = 10
  turnDisplay.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
}

setInterval(() => {
  if (phase === 'placement' || phase === 'movement') {
    gameSeconds--
    gameTimerSpan.textContent = gameSeconds

    turnSeconds--
    turnTimerSpan.textContent = turnSeconds

    if (turnSeconds <= 0) {
      console.log(`⏳ ${currentPlayer.toUpperCase()} timed out!`)
      switchTurn()
    }

    if (gameSeconds <= 0) {
      console.log('⏰ Game Over!')
      phase = 'ended'
    }
  }
}, 1000)
function getNeighbors(id) {
  const neighborIDs = []

  edges.forEach(({ 0: from, 1: to }) => {
    if (from === id) neighborIDs.push(to)
    if (to === id) neighborIDs.push(from)
  })

  return neighborIDs
}
let selectedNode = null

node.addEventListener('click', () => {
  const id = +node.dataset.id
 if (phase === 'placement') {
  if (node.dataset.owner) return
  if (id > 5) return // only outer ring during placement

  node.style.backgroundColor = playerColors[currentPlayer]
  node.dataset.owner = currentPlayer

  placedTitans[currentPlayer]++

  eliminateSurroundedTitans()
  updateScore()

  if (placedTitans[currentPlayer] === maxTitansPerPlayer) {
    currentPlayer = currentPlayer === 'red' ? 'blue' : 'red'
  }

  if (placedTitans.red === 4 && placedTitans.blue === 4) {
    phase = 'movement'
    console.log('%c>>> Movement Phase Begins <<<', 'color: yellow')
  } else {
    console.log(`Turn: ${currentPlayer.toUpperCase()}`)
  }
}
 if (phase === 'movement') {
    if (!selectedNode && node.dataset.owner === currentPlayer) {
      selectedNode = node
      node.style.outline = '2px solid yellow'
    } else if (selectedNode && node.dataset.owner === undefined) {
      const fromId = +selectedNode.dataset.id
      const neighbors = getNeighbors(fromId)

      if (neighbors.includes(id)) {
        node.dataset.owner = currentPlayer
        node.style.backgroundColor = playerColors[currentPlayer]

        selectedNode.dataset.owner = ''
        selectedNode.style.backgroundColor = 'white'
        selectedNode.style.outline = ''

        selectedNode = null

        updateScore()
        switchTurn()
      }
    }
  }
})
let scores = { red: 0, blue: 0 }

function updateScore() {
  scores.red = 0
  scores.blue = 0

  edges.forEach(([from, to, weight]) => {
    const fromNode = document.querySelector(`.node[data-id="${from}"]`)
    const toNode = document.querySelector(`.node[data-id="${to}"]`)
    const ownerA = fromNode.dataset.owner
    const ownerB = toNode.dataset.owner

    if (ownerA && ownerA === ownerB) {
      scores[ownerA] += weight
    }
  })

  document.getElementById('red-score').textContent = scores.red
  document.getElementById('blue-score').textContent = scores.blue
}
function eliminateSurroundedTitans() {
  document.querySelectorAll('.node').forEach(node => {
    const owner = node.dataset.owner
    if (!owner) return

    const id = +node.dataset.id
    const neighbors = getNeighbors(id)

    const isSurrounded = neighbors.every(nId => {
      const neighbor = document.querySelector(`.node[data-id="${nId}"]`)
      return neighbor.dataset.owner && neighbor.dataset.owner !== owner
    })

    if (isSurrounded) {
      console.log(`💥 Titan at node ${id} eliminated (${owner})`)
      node.dataset.owner = ''
      node.style.backgroundColor = 'white'
    }
  })
}
if (neighbors.includes(id)) {
  node.dataset.owner = currentPlayer
  node.style.backgroundColor = playerColors[currentPlayer]

  selectedNode.dataset.owner = ''
  selectedNode.style.backgroundColor = 'white'
  selectedNode.style.outline = ''

  selectedNode = null

  eliminateSurroundedTitans()
  updateScore()
  switchTurn()
}
node.style.transition = 'opacity 0.4s ease'
node.style.opacity = 0
setTimeout(() => {
  node.style.opacity = 1
}, 200)
