// Selector
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const scoreNode = document.querySelector('.score')
const highScoreNode = document.querySelector('.high-score')
const modal = document.querySelector('.modal')
const gameOverNode = document.querySelector('.game-over')
const modalScore = document.querySelector('.last-score')
const playAgainBtn = document.querySelector('.play-again')

// Variables
let tileCount = 20 // jumlah kotak
let tileSize = canvas.width / tileCount - 2 // ukuran tiap kotak

let speed
let head_x
let head_y
let snake
let snakeTail
let apple_x
let apple_y
let direction_x
let direction_y
let score

class SnakePart {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

function reset() {
  canvas.style.boxShadow = '0 0 5px 2px rgba(30, 255, 0, 0.8)'

  // game speed
  speed = 4

  // snake initial position
  head_x = 10
  head_y = 10

  // snake initial length
  snake = []
  snakeTail = 0

  // apple initial posisiton
  apple_x = randomize(0, 19)
  apple_y = randomize(0, 19)

  // snake's direction
  direction_x = 0
  direction_y = 0

  // initial Score
  score = 0
  scoreNode.textContent = score
  highScoreNode.textContent = getHighScore() || 0
}

function getHighScore() {
  let highScore = localStorage.getItem('highScore')
  if (!highScore) {
    localStorage.setItem('highScore', JSON.stringify(score))
  }
  return JSON.parse(highScore)
}

function setHighScore(value) {
  localStorage.setItem('highScore', JSON.stringify(value))
}

// Events
document.addEventListener('keydown', (e) => {
  // left
  if (e.keyCode == 37 || e.keyCode == 65) {
    if (direction_x == 1) return // biar gk bisa jalan ke arah sebaliknya
    direction_x = -1
    direction_y = 0
  }

  // up
  if (e.keyCode == 38 || e.keyCode == 87) {
    if (direction_y == 1) return
    direction_x = 0
    direction_y = -1
  }

  // right
  if (e.keyCode == 39 || e.keyCode == 68) {
    if (direction_x == -1) return
    direction_x = 1
    direction_y = 0
  }

  // down
  if (e.keyCode == 40 || e.keyCode == 83) {
    if (direction_y == -1) return
    direction_x = 0
    direction_y = 1
  }
})

playAgainBtn.addEventListener('click', () => {
  modal.classList.remove('active')
  reset()
  drawGame()
})

// randomize integer
function randomize(min, max) {
  return Math.floor(Math.random() * max) + min
}

// check game over
function isGameOver() {
  if (head_x < 0 || head_y < 0 || head_x >= tileCount || head_y >= tileCount) {
    return true
  }
  for (let i = 0; i < snake.length; i++) {
    let part = snake[i]
    if (head_x == part.x && head_y == part.y) {
      return true
    }
  }
}

function checkAppleCollision() {
  // Check Collision
  if (apple_x == head_x && apple_y == head_y) {
    apple_x = randomize(0, 19)
    apple_y = randomize(0, 19)
    snakeTail++
    score++
    scoreNode.textContent = score
    if (snakeTail >= 5) {
      speed = 5
      canvas.style.boxShadow = '0 0 5px 2px rgba(0, 119, 255, 0.8)'
    }
    if (snakeTail >= 10) {
      speed = 6
      canvas.style.boxShadow = '0 0 5px 2px rgba(255, 255, 0, 0.8)'
    }
    if (snakeTail >= 15) {
      speed = 7
      canvas.style.boxShadow = '0 0 5px 2px rgba(255, 145, 0, 0.8)'
    }
    if (snakeTail >= 20) {
      speed = 8
      canvas.style.boxShadow = '0 0 5px 2px rgba(178, 101, 0, 0.8)'
    }
    if (snakeTail >= 25) {
      speed = 9
      canvas.style.boxShadow = '0 0 5px 2px rgba(111, 0, 255, 0.8)'
    }
    if (snakeTail >= 30) {
      speed = 12
      canvas.style.boxShadow = '0 0 5px 2px rgba(148, 65, 255, 0.8)'
    }
    if (snakeTail >= 40) {
      speed = 14
      canvas.style.boxShadow = '0 0 5px 2px rgba(222, 0, 255, 0.8)'
    }
  }
}

// game loop
function drawGame() {
  // fillStyle => pilih warna
  // fillRect => bikin persegi panjang sesuai warna

  // Change Snake Position
  head_x += direction_x
  head_y += direction_y

  // Check gameover
  if (isGameOver()) {
    modal.classList.add('active')
    modalScore.textContent = score
    if (score > getHighScore()) {
      gameOverNode.innerHTML = 'GAMEOVER<br>NEW HIGH SCORE'
      setHighScore(score)
    } else {
      gameOverNode.innerHTML = 'GAMEOVER'
    }
    return
  }

  // Clear Screen
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  checkAppleCollision()

  // Draw Snake

  // draw parts
  ctx.fillStyle = 'orange'
  snake.forEach((part) => {
    const { x, y } = part
    ctx.fillRect(x * tileCount, y * tileCount, tileSize, tileSize)
  })
  snake.push(new SnakePart(head_x, head_y))
  while (snake.length > snakeTail) {
    snake.shift()
  }

  // draw head
  ctx.fillStyle = 'green'
  ctx.fillRect(head_x * tileCount, head_y * tileCount, tileSize, tileSize)

  // Draw Apple
  ctx.fillStyle = 'red'
  ctx.fillRect(apple_x * tileCount, apple_y * tileCount, tileSize, tileSize)

  setTimeout(drawGame, 1000 / speed)
}
reset()
drawGame()
