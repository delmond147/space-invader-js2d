// Setup game
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 630

// Create player
class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        const image = new Image()
        image.src = "./img/spaceship.png"
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
        // ctx.fillStyle = "red"
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.save() // snapshot the current position of player
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2) // player rotation
        ctx.rotate(this.rotation)
        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2) // reset to normal positon

        // draw player on screen
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
        ctx.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

// Create invader
class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0, //check this line for errors
            y: 0
        }
        const image = new Image()
        image.src = "./img/invader.png"
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,// check this line for errors
                y: position.y
            }
        }
    }
    draw() {
        // draw invader on screen
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
}

// Invader Grid class
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []

        const cols = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        this.width = cols * 30
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        positoin: {
                            x: x * 30,
                            y: y * 30
                        }
                    })
                )
            } // x ends
        }
        console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
        }
    }
}

// Create projectiles
class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 3
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const player = new Player()
const projectiles = []
const grids = [new Grid()]

// Player control keys
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// game animation on screen
function animate() {
    requestAnimationFrame(animate)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update() // player animation
    projectiles.forEach((projectile, index) => {
        if (projectile.position.x + projectile.radius <= 0) {
            setTimeout(() => {
                projectile.splice(index, 1)
            }, 0) // add frame before splice
        } else {
            projectile.update() // updating projectile 
        }
    })

    //update grids
    grids.forEach((grid) => {
        grid.update()
        grid.invaders.forEach((invader) => {
            invader.update({ velocity: grid.velocity })
        })
    })

    // key switching
    if (keys.a.pressed && player.position.x >= 0) {
        player.rotation = -0.15
        player.velocity.x = -8
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.rotation = 0.15
        player.velocity.x = 8
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }
}

animate()

// Keydown event listeners
addEventListener("keydown", ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break
        case ' ':
            console.log('space')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -15
                    }
                })
            )
            // console.log(projectiles)
            break
    }

})

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            console.log('right')
            keys.d.pressed = false
            break
        case ' ':
            console.log('space')
            break
    }

})