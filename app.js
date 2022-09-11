const grid = document.querySelector('.grid')
const brickWidth = 80
const brickHeight = 30
const boardWidth = 1000
const boardHeight = 800
const userStart = [445, 10]
const ballStart = [500, 41]
let currentPosition = userStart
let ballCP = ballStart
let ballXDirection = 1
let ballYDirection = 1
const ballWidth = 20
let timerID
let timerID2
const levelDisplay = document.getElementById('level')
let level = 1
levelDisplay.innerHTML = level


//Brick class
class Brick {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + brickWidth, yAxis]
    this.topRight = [xAxis + brickWidth, yAxis + brickHeight]
    this.topLeft = [xAxis, yAxis + brickHeight]
  }
}


// create a Brick and add them to bricks
function createBricks(number) {
  for (let i = 0; i < number - 1; i++) {
    let prevX = bricks[i].bottomRight[0]
    let prevY = bricks[i].bottomRight[1]
    let newX = prevX + 40
    let newY = prevY
    // for levels 1 and 2
    if (level < 3) {
      if(bricks[i].bottomRight[0] > boardWidth - brickWidth - 10) {
      newY = prevY - brickHeight - 10
      newX = 8
      }
    }
    bricks.push(new Brick(newX,newY))
  }
}

//draw my bricks
function drawBricks() {
  for (let i = 0; i < bricks.length; i++) {
    const brick = document.createElement('div')
    const row = Math.floor(i / 8)
    const col = Math.floor(i % 8)
    const colors = ['#CC0000', '#00CCCC', '#B266FF', '#99FF99', '#FF9933', '#66B2FF']
    // level one
    if (level == 1) {
      if (col % 2 == 1) {
        brick.style.backgroundColor = '#66B2FF'
      }
      else {
        brick.style.backgroundColor = '#99FF99'
      }
    } else if (level == 2) {
      if (row % 2 == 1) {
        brick.style.backgroundColor = '#00CCCC'
      }
      else {
        brick.style.backgroundColor = '#66B2FF'
      }
    }
    brick.classList.add('brick')
    brick.style.left = bricks[i].bottomLeft[0] + 'px'
    brick.style.bottom = bricks[i].bottomLeft[1] + 'px'
    grid.appendChild(brick)
  }
}

//draws the user block at current currentPosition
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

// draws the ball at the current ballCP
function drawBall() {
  ball.style.left = ballCP[0] + 'px'
  ball.style.bottom = ballCP[1] + 'px'
}

// window listens for key down and calls moveUser w the corresponding key pressed as event
document.addEventListener('keydown', moveUser)

// move user
function moveUser(event) {
  switch(event.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 5) {
      currentPosition[0] -= 28
      drawUser()
    }
      break;
    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - 130) {
      currentPosition[0] += 28
      drawUser()
    }
      break;
  }
}

// move ball
function moveBall() {
  checkCollision()
  ballCP[0] += ballXDirection
  ballCP[1] += ballYDirection
  drawBall()
  checkLevelOver(timerID)
}

//check for collissions
function checkCollision() {
  // bricks
  for (let i = 0; i < bricks.length; i++) {
    //Left
    if (ballCP[0] + ballWidth >= bricks[i].bottomLeft[0] && ballCP[0] < bricks[i].bottomLeft[0] + 3
    && ballCP[1] + ballWidth >= bricks[i].bottomLeft[1] && ballCP[1] <= bricks[i].topLeft[1]) {
      ballXDirection = 0 - Math.abs(ballXDirection)
      // put all active block classed divs into array
      const allBricks = Array.from(document.querySelectorAll('.brick'))
      //remove the brick class
      allBricks[i].classList.remove('brick')
      //cut out the brick object
      bricks.splice(i,1)
      //remove 1 one from i
      i--;
    }
    // right
    else if (ballCP[0] <= bricks[i].bottomRight[0] && ballCP[0] >= bricks[i].bottomRight[0] - 3
    && ballCP[1] >= bricks[i].bottomRight[1] && ballCP[1] <= bricks[i].topRight[1]) {
      ballXDirection = 0 + Math.abs(ballXDirection)
      // put all active block classed divs into array
      const allBricks = Array.from(document.querySelectorAll('.brick'))
      //remove the brick class
      allBricks[i].classList.remove('brick')
      //cut out the brick object
      bricks.splice(i,1)
      //remove 1 one from i
      i--;
    }
    // bottom
    else if (ballCP[0] + ballWidth >= bricks[i].bottomLeft[0] && ballCP[0] <= bricks[i].bottomRight[0]
        && ballCP[1] + ballWidth >= bricks[i].bottomLeft[1] && ballCP[1] + ballWidth <= bricks[i].bottomLeft[1] + 3) {
      ballYDirection = 0 - Math.abs(ballYDirection)
      // put all active block classed divs into array
      const allBricks = Array.from(document.querySelectorAll('.brick'))
      //remove the brick class
      allBricks[i].classList.remove('brick')
      //cut out the brick object
      bricks.splice(i,1)
      //remove 1 one from i
      i--;
    }

    //top
    else if (ballCP[0] + ballWidth > bricks[i].topLeft[0] && ballCP[0] < bricks[i].topRight[0]
        && ballCP[1] <= bricks[i].topLeft[1] && ballCP[1] >= bricks[i].topLeft[1] - 3) {
      ballYDirection = 0 + Math.abs(ballYDirection)
      // put all active block classed divs into array
      const allBricks = Array.from(document.querySelectorAll('.brick'))
      //remove the brick class
      allBricks[i].classList.remove('brick')
      //cut out the brick object
      bricks.splice(i,1)
      //remove 1 one from i
      i--;
    }
  }
  // walls
  if (ballCP[0] + ballWidth >= boardWidth
    || ballCP[0] <= 0) {
      ballXDirection *= -1
    }
  //ceiling
  if (ballCP[1] + ballWidth >= boardHeight) {
    ballYDirection *= -1
  }
  // paddle
  //far left
  if (ballCP[0] >= currentPosition[0] && ballCP[0] <= currentPosition[0] + 12
    && ballCP[1] <= currentPosition[1] + 30) {
      ballYDirection = 1
      ballXDirection = -1.5
      // middle Left
    }  else if (ballCP[0] > currentPosition[0] + 12 && ballCP[0] <= currentPosition[0] + 25
        && ballCP[1] <= currentPosition[1] + 30) {
        ballYDirection = 1
        ballXDirection = -1.2
      // far right
    } else if (ballCP[0] >= currentPosition[0] + 118 && ballCP[0] <= currentPosition[0] + 130
      && ballCP[1] <= currentPosition[1] + 30) {
        ballYDirection = 1
        ballXDirection = 1.5
        // middle right
      } else if (ballCP[0] >= currentPosition[0] + 105 && ballCP[0] < currentPosition[0] + 118
          && ballCP[1] <= currentPosition[1] + 30) {
            ballYDirection = 1
            ballXDirection = 1.2
        // middle
      } else if (ballCP[0] >= currentPosition[0] && ballCP[0] <= currentPosition[0] + 130
    && ballCP[1] <= currentPosition[1] + 30) {
        ballYDirection *= -1.1 - (0.1 * level)
        ballXDirection *= 0.9
    }
}

function checkLevelOver(interval) {
  if (ballCP[1] < currentPosition[1]) {
    level = 0
    levelDisplay.innerHTML = level
    clearInterval(interval)
  }
  if (bricks.length == 0) {
    level += 1
    levelDisplay.innerHTML = level
    currentPosition = [445, 10]
    ballCP = [500, 41]
    ballXDirection = 1
    ballYDirection = 1
    if (level == 2) {
      bricks = [
        new Brick(10, 750)
      ]
      createBricks(32)
      drawBricks()
      drawUser()
    }
  }
}

// the bricks on screen
let bricks = [
  new Brick(8, 750)
]

// add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

// add the ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)


createBricks(24)
drawBricks()
timerID = setInterval(moveBall,1)
