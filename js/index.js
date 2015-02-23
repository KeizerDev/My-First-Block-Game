$(function() {
	var grid = [], 
		gridWidth = 16,
		gridHeight = 12,
		colors = ['blue', 'green', 'pink'],
		$scoreContainer = $('<div>').addClass('score-container').appendTo('body'),
		$speedContainer = $('<div>').addClass('speed-container').appendTo('body'),
		$container = $('<div>').addClass('game-container').appendTo('body'),
		tempscore = 0,
		highscore = 0,
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

	function updateHighscore() {
		if(tempscore >= highscore) {
			highscore = tempscore;
			$scoreContainer.text('highscore: ' + highscore);
		}
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
			tempscore = 0;
			var $cell = $(this);
			$cell.addClass('active');
			checkNeighbors($cell);
			updateHighscore();
		});
	}

	function initRound() {
		tempscore = 0;
		updateHighscore();
		resetGrid();
		createGrid();
		timer = setTimeout(function(){
			initRound();
		}, currentSpeed);
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
	createHandlers();
	initRound();

});

