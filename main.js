// Setup
const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")

// Width & Height
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Mouse Position
const mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener("mousemove",(e)=>{
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})



// Point Class
class Point {
    constructor(game,x,y,radius,hoverColor, dotColor){
        this.game = game
        this.x = x
        this.y = y
        this.radius = Math.ceil(Math.random() * radius)
        this.radius = this.radius > 0.8 ? this.radius : Math.ceil(Math.random() * radius)
        this.color = hoverColor
        this.backup_dotColor = dotColor
        this.dotColor = dotColor
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.dotColor
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    
}

// Creature
class Creature {
    constructor(game,radius, color,autoMode) {
        this.game = game
        this.radius = radius
        
        this.currentColorIndex = 190
        this.color = `hsl(${this.currentColorIndex},50%,50%)`
        
        this.x = this.game.width / 2
        this.y = this.game.height / 2
        this.veloX = Math.random() * (Math.random() * 20) - 7;
        this.veloY = Math.random() * (Math.random() * 28) - 7;
        
        this.connect_distance = 100

        this.autoMode = autoMode
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.color
        
        if(this.autoMode === false){
            ctx.arc(mouse.x,mouse.y,this.radius,0,Math.PI * 2)
        }else{
            ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        }
        ctx.fill()
        ctx.closePath()
    }

    update() {
        // ctx.lineWidth = 1;
        if(this.autoMode === false){
            this.game.points.forEach((point)=>{
                let dx =  point.x - mouse.x
                let dy =  point.y - mouse.y     
                let distance = Math.sqrt(dx * dx + dy * dy)
                if(distance < this.connect_distance) {
                    ctx.beginPath()
                    ctx.strokeStyle = this.color
                    point.dotColor = this.color

                    var controlX = (point.x + mouse.x) / 2;
                    var controlY = point.y - 50;
                
                    // Draw the curve
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                    ctx.quadraticCurveTo(controlX, controlY, mouse.x, mouse.y);
                    ctx.stroke();
        
                }else{
                    point.dotColor = point.backup_dotColor
                }
            })
        }
        else{
            if(this.y > this.game.height + 10 | this.y < 0){
                this.veloY = -this.veloY
                this.color = `hsl(${this.currentColorIndex},50%,50%)`
                this.currentColorIndex += 30
                console.log(this.currentColorIndex);
            }
            if(this.x > this.game.width + 10 | this.x < 0){
                this.veloX = -this.veloX
                this.color = `hsl(${this.currentColorIndex},50%,50%)`
                this.currentColorIndex += 30
                console.log(this.currentColorIndex);
            }
            
            this.game.points.forEach((point)=>{
                let dx =  point.x - this.x
                let dy =  point.y - this.y     
                let distance = Math.sqrt(dx * dx + dy * dy)
                
                if(distance < this.connect_distance) {
                    ctx.beginPath()
                    ctx.strokeStyle = this.color
                    point.dotColor = this.color
                    
                    var controlX = (this.x + point.x) / 2;
                    var controlY = this.y - 50;
                    
                    // Draw the curve
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.quadraticCurveTo(controlX, controlY, point.x, point.y);
                    ctx.stroke();
                }
                else{
                    point.dotColor = point.backup_dotColor
                }
            })

            this.y += this.veloY
            this.x += this.veloX
        }

    }
}

// Game Class
class Game{
    constructor(width,height,autoMode) {
        this.width = width
        this.height = height        
        this.points = []
        this.spider = new Creature(this,7,"rgb(107, 215, 255)",autoMode)
        this.currentMode = this.spider.autoMode
        this.createBackgroundDots(true)
        
        window.addEventListener("click",()=>{
            this.spider.x = mouse.x
            this.spider.y = mouse.y
            this.spider.veloX = Math.random() * 5 - 2;
            this.spider.veloY = Math.random() * 5 - 5;
            this.spider.autoMode = !this.currentMode
            this.currentMode = this.spider.autoMode
        })
    }

    createBackgroundDots(isRandom=true){
        let cellWidth = this.width / 20
        let cellHeight = this.height / 20
        
        if(isRandom === false) {
            for(let y = 0; y < canvas.height; y += cellHeight){
                for(let x = 0; x < canvas.width; x += cellWidth){
                    this.points.push(new Point(this,x,y,3,"rgb(33, 141, 181)","rgb(5,5,5)"))
                }               
            }
        }else{
            for(let x = 0; x < this.width * 0.25; x++){
                let _x = Math.random() * this.width
                let _y = Math.random() * this.height
                this.points.push(new Point(this,_x,_y,5,"rgb(33, 141, 181)","rgb(5,5,5)"))
            }               
        }
    }
    
    draw() {
        this.spider.draw()
        this.points.forEach((point)=>{
            point.draw()
        })
    }
    
    update() {
        this.spider.update()
    }

    render(){
        this.update()   
        this.draw()   
    }
}

const game = new Game(canvas.width,canvas.height,false)

function animate() {
    // ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "rgba(0,0,0,0.15)"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    game.render()
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
