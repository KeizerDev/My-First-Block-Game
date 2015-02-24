$(function() {
	var grid = [], 
		gridWidth = 16,
		gridHeight = 12,
		colors = ['blue', 'green', 'pink'],
		$scoreContainer = $('<div>').addClass('score-container').appendTo('body'),
		$speedContainer = $('<div>').addClass('speed-container').appendTo('body'),
		$container = $('<div>').addClass('game-container').appendTo('body'),
		$lowest, $average, $highest, $reset,
		tempscore = 0,
		score = {
			tempscore: 0,
			lowest: null,
			average: null,
			highest: null,
			clickCounter: 0
		},
		clicked = false,
		currentSpeed = 2000,
		timer;

	function createGrid() {
		var x, y;
		$container.css('width', gridWidth * 50);
		for (y = 0; y < gridHeight; y++) {
			for (x = 0; x < gridWidth; x++) {
				cellData = {};
				cellData.x = x;
				cellData.y = y;
				cellData.color = colors[Math.floor(Math.random()*colors.length)];

				var $cellDiv = $('<div>').addClass('cell ' + cellData.color).css({
					left: x * 50,
					top: y * 50
				});;

				cellData.div = $cellDiv;
				if(!grid[y])
					grid[y] = [];
				grid[y][x] = cellData;
				$cellDiv.data('cellData', cellData);
				$container.append($cellDiv);
			};
		};
	}

	function updateScores() {
		if(score.highest == null || tempscore > score.highest) {
			score.highest = tempscore;
			$highest.text(score.highest);
		}

		if(score.lowest == null || tempscore < score.lowest) {
			score.lowest = tempscore;
			$lowest.text(score.lowest);
		}
		if(score.average == null) {
			score.average = tempscore;
		} else {
			score.average = Math.round(((score.average * (score.clickCounter - 1) + tempscore) / score.clickCounter) * 10) / 10;
		}
		$average.text(score.average);
		
		//Store whole score object as string
 		localStorage.setItem('score', JSON.stringify(score));
	}

	function checkNeighbors($cell) {
		var cellData = $cell.data('cellData');
		//Check right neighbox
		if(grid[cellData.y - 1] && grid[cellData.y - 1][cellData.x]) {
			matchNeighbor(grid[cellData.y - 1][cellData.x], cellData.color)
		}

		if(grid[cellData.y] && grid[cellData.y][cellData.x + 1]) {
			matchNeighbor(grid[cellData.y][cellData.x + 1], cellData.color);
		}

		if(grid[cellData.y + 1] && grid[cellData.y + 1][cellData.x]) {
			matchNeighbor(grid[cellData.y + 1][cellData.x], cellData.color);
		}

		if(grid[cellData.y] && grid[cellData.y][cellData.x - 1]) {
			matchNeighbor(grid[cellData.y][cellData.x - 1], cellData.color);
		}

	}

	function matchNeighbor(target, color) {
		var targetData = target.div.data('cellData');
		if(!target.div.hasClass('active') && color == targetData.color) {
			target.div.addClass('active');
			tempscore++;
			checkNeighbors(target.div);
		}
	}

	function resetGrid() {
		grid = [];
		$container.html('');
		clicked = false;
	}
	
	function createHandlers() {
		$container.on('click', '.cell', function(event){
			event.preventDefault();
			if(clicked) return;
			clicked = true;
			tempscore = 1;
			score.clickCounter++;
			var $cell = $(this);
			$cell.addClass('active');
			checkNeighbors($cell);
			updateScores();
		});
	}

	function initRound() {
		tempscore = 0;
		resetGrid();
		createGrid();
		timer = setTimeout(function(){
			initRound();
		}, currentSpeed);
	}
	function createScoreInterface() {
		$lowest = $('<div>').addClass('lowest').text((score.lowest ? score.lowest : '-'));
		$average = $('<div>').addClass('average').text((score.average ? score.average : '-'));
		$highest = $('<div>').addClass('highest').text((score.highest ? score.highest : '-'));
		$reset = $('<div>').addClass('reset').text('reset');
		
		$reset.click(function(){
			localStorage.removeItem('score');
			score = {
				tempscore: 0,
				lowest: null,
				average: null,
				highest: null,
				clickCounter: 0
			}
			tempscore = 0;
			$lowest.text('-');
			$average.text('-');
			$highest.text('-');
		});
		
		$scoreContainer.append($lowest, $average, $highest, $reset);
	}
	function createSpeedInterface() {
		var $slower = $('<div>').addClass('slower').html('&laquo');
		var $speed = $('<div>').addClass('speed').text(currentSpeed);
		var $faster = $('<div>').addClass('faster').html('&raquo');
		
		$speedContainer.append($slower, $speed, $faster);

		$slower.click(function(){
			if(currentSpeed >= 3000) return;
			currentSpeed += 250;
			$speed.text(currentSpeed);
		});
		$faster.click(function(){
			if(currentSpeed <= 500) return;
			currentSpeed -= 250;
			$speed.text(currentSpeed);
		});
	}

	//Get score object from local storage if exists
	if(localStorage.getItem('score') != null) {
		score = JSON.parse(localStorage.getItem('score'));
	}

	createSpeedInterface();
	createScoreInterface();
	createHandlers();
	initRound();

});

