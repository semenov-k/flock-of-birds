/**
 * Created by semenov on 20.12.16.
 */

var canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var ctx = canvas.getContext('2d');


var particles = [];

////////////////////////////////////////
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
};

Vector.prototype.getMagnitude = function () {
    return Math.round(Math.sqrt(this.x * this.x + this.y * this.y));
};

Vector.prototype.getAngle = function () {
    return Math.atan2(this.x, this.y);
};

Vector.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

////////////////////////////////////////////
function Particle(angle, magnitude, position) {
    this.position = position;
    this.velocity = Vector.fromAngle(angle, magnitude);
}

////////////////////////////////////////////
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

////////////////////////////////////////////
var mouse_down = false;
var mouseVector;
canvas.addEventListener('mousedown', function (e) {
    mouseVector = new Vector(e.clientX, e.clientY);
    mouse_down = true;
});
canvas.addEventListener('mousemove', function (e) {
    mouseVector = new Vector(e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', function () {
    mouse_down = false;
});

// Speed = px/16ms
function update(delta) {
    if(mouse_down){
        for(var i = 0; i < 10; i++){
            particles.push(new Particle(Math.random() * 360, 2, mouseVector));
        }
    }
    particles.forEach(function (p) {
        p.position.add(new Vector(p.velocity.x / 16 * delta, p.velocity.y / 16 * delta));
        if(p.position.x <= 0 || p.position.x >= canvas.width){
            p.velocity = new Vector(-p.velocity.x, p.velocity.y);
        }
        if(p.position.y <= 0 || p.position.y >= canvas.height){
            p.velocity = new Vector(p.velocity.x, -p.velocity.y);
        }

    })
}

function draw(delta) {
    ctx.font = '10px';
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillText('Par. ' + particles.length, 28, 28);
    ctx.fillText('FPS ' + Math.round(1000 / delta), 28, 40);
    particles.forEach(function (p) {
        var radius = new Vector(Math.abs(mouseVector.x - p.position.x),
                                Math.abs(mouseVector.y - p.position.y)).getMagnitude();
        ctx.fillStyle = 'rgb(255, 215, 0)';
        if(radius <= 100){
            ctx.fillStyle = 'rgb(' + radius + ', ' + (215 - radius) +', 0)';
        }
        ctx.fillRect(p.position.x, p.position.y, 2, 2);
    })
}


///////////////////////////////////////////////
var start_time;
var end_time = Date.now();


var loop = function() {
    clear();
    start_time = Date.now();
    update(start_time - end_time);
    draw(start_time - end_time);
    end_time = Date.now();
    requestAnimationFrame(loop);
};

loop();

