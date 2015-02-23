$(function() {
	var grid = [], 
		gridWidth = 16,
		gridHeight = 12,
		colors = ['blue', 'green', 'pink'],
		$scoreContainer = $('<div>').addClass('score-container').appendTo('body'),
		$speedContainer = $('<div>').addClass('speed-container').appendTo('body'),
		$container = $('<div>').addClass('game-container').appendTo('body'),
		$lowest, $average, $highest,
		tempscore = 0,
		clickCounter = 0,
		score = {
			lowest: null,
			average: null,
			highest: null
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
				//console.log(cellData.ran);
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
		if(score.lowest == null || tempscore > score.highest) {
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
			score.average = Math.round(((score.average * (clickCounter-1) + tempscore) / clickCounter) * 10) / 10;
		}
		$average.text(score.average);
		
//		$scoreContainer.text((score.lowest != null ? score.lowest : '-') + ' / ' + score.average + ' / ' + score.highest);
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
			clickCounter++;
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
		$lowest = $('<div>').addClass('lowest').text('-');
		$average = $('<div>').addClass('average').text('-');
		$highest = $('<div>').addClass('highest').text('-');
		
		$scoreContainer.append($lowest, $average, $highest);
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
	createSpeedInterface();
	createScoreInterface();
	createHandlers();
	initRound();

});

