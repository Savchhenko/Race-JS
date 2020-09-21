const score = document.querySelector(".score"),
	start = document.querySelector(".start"),
	gameArea = document.querySelector(".gameArea"),
	car = document.createElement("div");

car.classList.add("car");

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
};

// эта функция считает сколько элементов заданной высоты поместится на странице
function getQuantityElements(heightElement) {
	return document.documentElement.clientHeight / heightElement + 1; //высоту страницы разделили на высоту элемента
}

function startGame() {
	start.classList.add("hide");
	gameArea.innerHTML = "";

	//цикл, который создает движущиеся полосы на дороге
	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement("div");
		line.classList.add("line");
		line.style.top = i * 100 + "px";
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
		// (100 * setting.traffic) влияет на плотность автомобилей, где 100 это высота авто
		const enemy = document.createElement("div");
		enemy.classList.add("enemy");
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		enemy.style.top = enemy.y + "px";
		enemy.style.background = "transparent url('./image/enemy2.png') center / cover no-repeat";
		gameArea.appendChild(enemy);
	}
	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; //задаем фиксированное положение авто при старте
	car.style.top = "auto";
	car.style.bottom = "10px";
	setting.x = car.offsetLeft; /* координата Х будет меняться во время игры */
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
		setting.score += setting.speed;
		score.innerHTML = "Score:<br>" + setting.score;
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			//задали второе условие, чтобы машина не выходила за пределы дороги
			setting.x -= setting.speed;
		}

		if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
			setting.x += setting.speed;
		}

		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}

		if (keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) {
			setting.y += setting.speed;
		}

		car.style.left = setting.x + "px";
		car.style.top = setting.y + "px";

		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault(); //отменили стандартное поведение браузера при нажатии клавиш (например скрол страницы)
	keys[event.key] = true;
}

function stopRun(event) {
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
	let lines = document.querySelectorAll(".line");
	lines.forEach(function (line) {
		line.y += setting.speed;
		line.style.top = line.y + "px";

		if (line.y >= document.documentElement.clientHeight) {
			line.y = -100;
		}
	});
}

function moveEnemy() {
	let enemy = document.querySelectorAll(".enemy");
	enemy.forEach(function (item) {
		// item это есть enemy (машина)
		let carRect = car.getBoundingClientRect(); //эта переменная получает параметры авто
		let enemyRect = item.getBoundingClientRect();

		// определяем границы соприкосновения автомобилей
		if (
			carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top
		) {
			setting.start = false;
			console.warn("дтп");
			start.classList.remove("hide");
			start.style.top = score.offsetHeight;
		}

		item.y += setting.speed / 2;
		item.style.top = item.y + "px";
		if (item.y >= document.documentElement.clientHeight) {
			item.y = -100 * setting.traffic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		}
	});
}
