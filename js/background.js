var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var particleCount = 750;

var mouse = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	lastMoveTime: Date.now()
};

window.addEventListener("mousemove", function(event) {
	mouse.x = event.clientX - canvas.width / 2;
	mouse.y = event.clientY - canvas.height / 2;
	mouse.lastMoveTime = Date.now(); // 记录最近一次移动时间
});

window.addEventListener("resize", function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	lightParticles = [];
	initializeParticles();
});

function LightParticle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;

	this.update = function() {
		this.draw();
	};

	this.draw = function() {
		c.save();
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.shadowColor = this.color;
		c.shadowBlur = 15;
		c.shadowOffsetX = 0;
		c.shadowOffsetY = 0;
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	};
}

var lightParticles = [];

var timer = 0;
var opacity = 1;
var speed = 0.001;

var colors = [
	// "#fff787",
	// "#A5BFF0",
	// "#c7ef85",
	// "#ffcdeb",
	// "#F2E8C9"
	"#ffffff",
	"#c4c4c4",
	"#d0d0d0",
	"#979797",
	"#d0bd75",
	 // "#faf298"
];

var initializeParticles;

(initializeParticles = function() {
	for (var i = 0; i < particleCount; i++) {
		var randomColorIndex = Math.floor(Math.random() * colors.length);
		var randomRadius = Math.random() * 2;

		var x = (Math.random() * (canvas.width + 200)) - (canvas.width + 200) / 2;
		var y = (Math.random() * (canvas.height + 200)) - (canvas.height + 200) / 2;

		lightParticles.push(
			new LightParticle(x, y, randomRadius, colors[randomColorIndex])
		);
	}
})();

function animate() {
	requestAnimationFrame(animate);

	var now = Date.now();
	var isMouseMoving = (now - mouse.lastMoveTime) < 120; 
	// ↑ 120ms 内算“正在滑动”，你可以调

	c.save();

	if (isMouseMoving) {
		// 鼠标在动 → 加速 + 背景变淡
		var desiredOpacity = 0.05;
		opacity += (desiredOpacity - opacity) * 0.08;
		c.fillStyle = "rgba(18, 18, 18," + opacity + ")";

		var desiredSpeed = 0.012;
		speed += (desiredSpeed - speed) * 0.05;
		timer += speed;
	} else {
		// 鼠标停 → 恢复
		var originalOpacity = 1;
		opacity += (originalOpacity - opacity) * 0.008;
		c.fillStyle = "rgba(18, 18, 18," + opacity + ")";

		var originalSpeed = 0.001;
		speed += (originalSpeed - speed) * 0.008;
		timer += speed;
	}

	c.fillRect(0, 0, canvas.width, canvas.height);
	c.translate(canvas.width / 2, canvas.height / 2);
	c.rotate(timer);

	for (var i = 0; i < lightParticles.length; i++) {
		lightParticles[i].update();
	}

	c.restore();
}

animate();
