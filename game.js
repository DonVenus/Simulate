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

	var redArray = [];
	var blueArray = [];
	var laserArray = [];
	function person(positionX, positionY, color) {
		this.posX = positionX;
		this.posY = positionY;
		this.indColor = color;
		this.coolDown = 0;
		this.health = 3;
		this.fireLaser = function(velX, velY) {
			laserArray.push(new laser(this.posX, this.posY, velX, velY, this.indColor));
			this.coolDown = 20;
		}
	}

	function laser(posX, posY, velX, velY, color) {
		this.posX = posX + velX;
		this.posY = posY + velY;
		this.velX = velX;
		this.velY = velY;
		this.indColor = color;
		this.move = function() {
			this.posX += velX;
			this.posY += velY;
		}
	}


	var blueCounter = document.getElementById('blue-count');
	var redCounter = document.getElementById('red-count');
	function handleClick(x, y) {
		var per = new person(x, y, placeColor)
		if (placeColor == redColor) {
			redArray.push(per);
			redCount++;
			redCounter.innerHTML = redCount;
		}
		if (placeColor == blueColor) {
			blueArray.push(per);
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

	function findDist(a, b) {
		return Math.sqrt((Math.pow((a.posX - b.posX),2) + Math.pow((a.posY - b.posY),2)));
	}

	function handlePeople(personArray) {
		for (var i = 0; i < personArray.length; i++) {
			ctx.fillStyle = personArray[i].indColor;
			ctx.fillRect(personArray[i].posX, personArray[i].posY, 5, 5);
			if (personArray[i].health == 2) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.33';
				ctx.fillRect(personArray[i].posX, personArray[i].posY, 5, 5);
			}
			if (personArray[i].health == 1) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.66';
				ctx.fillRect(personArray[i].posX, personArray[i].posY, 5, 5);
			}
			if (personArray[i].health == 0) {
				ctx.fillStyle = 'rgba(255, 255, 255, 1';
				ctx.fillRect(personArray[i].posX, personArray[i].posY, 5, 5);
				personArray.splice(i, 1);
				continue;
			}
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
			if (personArray[i].indColor == blueColor) {
				findTarget(personArray[i], redArray);
			}
			if (personArray[i].indColor == redColor) {
				findTarget(personArray[i], blueArray);
			}
		}
	}

	function findTarget(person, arr) {
		if (person.coolDown == 0) {
			if (arr.length > 0) {
				var closest = arr[0];
				var closestDist = findDist(person, arr[0]);
				for (var i = 1; i < arr.length; i++) {
					var dist = findDist(person, arr[i]);
					if (dist < closestDist) {
						closest = arr[i];
						closestDist = dist;
					}
				}
				var errX = Math.floor((Math.random() * closestDist / 8) - closestDist / 16);
				var errY = Math.floor((Math.random() * closestDist / 8) - closestDist / 16);
				var diffX = closest.posX - person.posX + errX;
				var diffY = closest.posY - person.posY + errY;
				var angleRad = Math.atan2(diffY, diffX);
				var xVel = Math.cos(angleRad) * 5;
				var yVel = Math.sin(angleRad) * 5;
				person.fireLaser(xVel, yVel);
			}
		}
		else {
			person.coolDown--;
		}	
	}

	function handleLasers() {
		for (var j = 0; j < laserArray.length; j++) {
			ctx.fillStyle = laserArray[j].indColor;
			ctx.fillRect(laserArray[j].posX, laserArray[j].posY, 3, 3);
			laserArray[j].move();
			if (laserArray[j].posX > 600 || laserArray[j].posX < 0 || laserArray[j].posY > 600 || laserArray[j].posY < 0) {
				laserArray.splice(j, 1);
			}
			else {
				if(!handleLaserCollisions(laserArray[j], j, redArray)) {
					handleLaserCollisions(laserArray[j], j, blueArray);
				}
			}
		}
	}

	function handleLaserCollisions(laser, index, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (Math.abs(arr[i].posX - laser.posX) <= 4 && Math.abs(arr[i].posY - laser.posY) <= 4) {
				laserArray.splice(index, 1);
				arr[i].health--;
				return true;
			}
		}
		return false;
	}

	function runGame() {
		ctx.clearRect(0,0,600,600);
		handleLasers();
		handlePeople(redArray);
		handlePeople(blueArray);
		window.requestAnimationFrame(runGame);
	}


	startGame();
})();