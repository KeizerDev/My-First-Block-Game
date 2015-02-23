$(function() {
	var grid = [], 
		gridWidth = 20,
		gridHeight = 30,
		colors = ['#F00', '#0F0', '#00F'],
		$container = $('body').append('<div>').addClass('game-container'),
		score = 0,
		timer;

	function createGrid() {
		var x, y;
		

		for (y = 0; y < gridHeight; y++) {
			for (x = 0; x < gridWidth; x++) {
				cellData = {};
				cellData.x = x;
				cellData.y = y;
				cellData.color = colors[Math.floor(Math.random()*colors.length)];

				var $cellDiv = $('<div>').addClass('cell').css({
					backgroundColor: cellData.color,
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

	function getScore() {
		console.log(score);
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
			score++;
			checkNeighbors(target.div);
		}
		
	}

	function resetGrid() {
		grid = [];
		$container.html('');
	}
	
	function createHandlers() {
		$container.on('click', '.cell', function(event){
			event.preventDefault();
			var $cell = $(this);
			$cell.addClass('active');
			score++;
			checkNeighbors($cell);
			getScore();
			console.log('click', $cell.data('cellData'));
		});
	}

	function initRound() {
		resetGrid();
		createGrid();

		timer = setTimeout(function(){
			initRound();
		}, 2000);
	}
	createHandlers();
	initRound();

});

