(function() {
	var canvas = document.getElementById('game');
	var canvasLeft = canvas.offsetLeft;
	var canvasTop = canvas.offsetTop;
	var ctx = canvas.getContext('2d');
	var redCount = 0;
	var blueCount = 0;
	var redColor = 'rgb(200, 0, 0)';
	var blueColor = 'rgb(0, 0, 200)';
	var placeColor = redColor;

	canvas.addEventListener('click', function(event) {
		var x = event.pageX - canvasLeft;
		var y = event.pageY - canvasTop;
		handleClick(x, y);
		}
		, false);

	var personArray = [];
	function person(positionX, positionY, color) {
		this.posX = positionX;
		this.posY = positionY;
		this.indColor = color;
	}


	var blueCounter = document.getElementById('blue-count');
	var redCounter = document.getElementById('red-count');
	function handleClick(x, y) {
		personArray.push(new person(x, y, placeColor));
		if (placeColor == redColor) {
			redCount++;
			redCounter.innerHTML = redCount;
		}
		if (placeColor == blueColor) {
			blueCount++;
			blueCounter.innerHTML = blueCount;
		}
	}

	var placeRed = document.getElementById('place-red');
	var placeBlue = document.getElementById('place-blue');
	placeRed.addEventListener('click', function() {
		placeColor = redColor;
		console.log('place red');
	}, false);
	placeBlue.addEventListener('click', function() {
		placeColor = blueColor;
		console.log('place blue');
	}, false);

	function startGame() {
		console.log('started');
		window.requestAnimationFrame(runGame);
	}

	function runGame() {
		ctx.clearRect(0,0,600,600);
		for (var i = 0; i < personArray.length; i++) {
			ctx.fillStyle = personArray[i].indColor;
			ctx.fillRect(personArray[i].posX, personArray[i].posY, 4, 4);
			var moveX = Math.floor(Math.random() * 2);
			var moveY = Math.floor(Math.random() * 2);
			var moveUp = Math.floor(Math.random() * 2);
			var moveRight = Math.floor(Math.random() * 2);
			if (personArray[i].posX == 600) {
				moveRight = 0;
			}
			if (personArray[i].posY == 600) {
				moveUp = 0;
			}
			if (personArray[i].posX == 0) {
				moveRight = 1;
			}
			if (personArray[i].posY == 0) {
				moveUp = 1;
			}
			if (moveX) {
				if (moveRight) {
					personArray[i].posX++;
				}
				else {
					personArray[i].posX--;
				}
			}
			if (moveY) {
				if (moveUp) {
					personArray[i].posY++;
				}
				else {
					personArray[i].posY--;
				}
			}
		}

		window.requestAnimationFrame(runGame);
	}


	startGame();
})();