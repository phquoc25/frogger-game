const bugImage = 'images/enemy-bug.png';
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;
const BUG_START_X = -CELL_WIDTH;
const PLAYER_START_X = CELL_WIDTH * 2;
const PLAYER_MAX_Y = CELL_HEIGHT * 5;

// Game objects
var GameObject = function(image, x, y) {
    this.sprite = image;
    this.x = x;
    this.y = y;
};

// Draw the enemy on the screen, required method for game
GameObject.prototype.render = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameObject.prototype.getLeft = function () {
    return this.x;
};

GameObject.prototype.getRight = function () {
    return this.x + CELL_WIDTH;
};

GameObject.prototype.getCurrentRow = function () {
    return this.y;
};

GameObject.prototype.checkCollision = function (otherGameObj) {
    return this.getCurrentRow() === otherGameObj.getCurrentRow() &&
        this.getRight() - CELL_WIDTH / 2 >= otherGameObj.getLeft() &&
        this.getLeft() + CELL_WIDTH / 2 <= otherGameObj.getRight();

};

// Enemies our player must avoid
var Enemy = function(image, x, y) {
    GameObject.call(this, image, x, y);
    this.speed = 10;
};
Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x >= ctx.canvas.width ? BUG_START_X : this.x + this.speed * dt;

    //handle collision
    if (this.checkCollision(player)) {
        player.reset();
    }
};
Enemy.prototype.setSpeed = function(speed) {
    this.speed = speed;
};

// Now write your own player class
var Player = function(image, x, y) {
    GameObject.call(this, image, x, y);
};
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
    const PLAYER_MAX_X = ctx.canvas.width - CELL_WIDTH;
    if (this.x > PLAYER_MAX_X) {
        this.x = PLAYER_MAX_X;
    } else if (this.x < 0) {
        this.x = 0;
    }

    if (this.y > PLAYER_MAX_Y) {
        this.y = PLAYER_MAX_Y;
    } else if (this.y <= 0) {
        this.y = 0
    }
};
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x -= CELL_WIDTH;
            break;
        case 'right':
            this.x += CELL_WIDTH;
            break;
        case 'up':
            this.y -= CELL_HEIGHT;
            break;
        case 'down':
            this.y += CELL_HEIGHT;
            break;
        default:
            break;
    }
};

Player.prototype.reset = function () {
    this.x = PLAYER_START_X;
    this.y = PLAYER_MAX_Y;
};
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
allEnemies = [];

var bugLevel1 = new Enemy(bugImage, BUG_START_X, 0);
bugLevel1.setSpeed(50);
var bugLevel2 = new Enemy(bugImage, BUG_START_X, CELL_HEIGHT);
bugLevel2.setSpeed(50 * 2);
allEnemies.push(bugLevel1);
allEnemies.push(bugLevel2);
// Place the player object in a variable called player
player = new Player('images/char-boy.png', PLAYER_START_X, PLAYER_MAX_Y);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
