var isRunning = true;
var c = document.getElementsByTagName("canvas")[0];
x = c.getContext("2d");

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

function R(r, g, b, a) {
	a = a === undefined ? 1 : a;
	return "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a + ")";
}

function resizeCanvas() {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	x.font = "18px Arial";
}

function snowFlakes(t) {
	x.clearRect(0, 0, c.width, c.height);
	for(i=0;i<c.width/2;i++) {
		x.fillText(".",-20+i*2+Math.sin(t+i)*20, 10+Math.tan(t/40+Math.tan(i)*2)*10)
		x.fillStyle=R(200+(Math.cos(i)+1)*30,200+(Math.cos(i)+1)*30,200+(Math.cos(i)+1)*30);
	}
}

var time = 0;
var frame = 0;
var nextFrameMs = 0;
var FPS = 60;

function loop(frame_time) {
	backgroundAnim = requestAnimationFrame(loop);
	epsilon = 1.5; // Acounts for different timestamp resolution and slight jitter
	if (frame_time < nextFrameMs - epsilon) {
		return; // Skip this cycle as we are animating too quickly.
	}
	nextFrameMs = Math.max(nextFrameMs + 1000 / FPS, frame_time);
	time = frame / FPS;
	if (time * FPS | 0 == frame - 1) {
		time += 0.000001;
	}
	frame++;
	snowFlakes(time);
}
var backgroundAnim = requestAnimationFrame(loop);

function pauseAnim(e) {
	if ( isRunning ) {
		cancelAnimationFrame(backgroundAnim);
	} else {
		backgroundAnim = requestAnimationFrame(loop);
	}
	isRunning = !isRunning;
}