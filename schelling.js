/**
 * Schelling's Model simulator
 * @author Tyler Weir
 */

// Global Constants
const cell = "<div id='cell'></div>"

// Global Variables
var simBoard = [];
var running = false;
var generations = 0;

/**
 * Creates the table based on the parameters set by the user. 
 * @param size
 */
function createTable(size) {

	// Generate the HTML for the table
	var table = "<table>";
	for (let i = 0; i < size; i++) {
		table += "<tr>"
		for (let j = 0; j < size; j++) {
			table += "<td>"+cell+"</td>";
		}
		table += "</tr>";
	}
	
	let board = document.getElementById("board");
	board.innerHTML = table;
}

/**
 * Build the sim_board according to the new size and other parameters.
 */
function initBoard(size) {
	simBoard = [];
	generations = 0;

	let popSplit = document.getElementById("popRatio").value;
	let numVacant = document.getElementById("vacantRatio").value;
	
	// Iterate over every cell
	for (let i = 0; i < size; i++) {
		var row = [];
		for (let j = 0; j < size; j++) {
			// Make empty?
			if (Math.random() < numVacant) {
				row.push(0);
			} else {
				// What population?
				if(Math.random() < popSplit) {
					row.push(1);
				} else {
					row.push(2);
				}
			}
		}
		simBoard.push(row);
	}
}

/**
 * Makes the displayed board represent the simBoard.
 */
function displayBoard() {
		
	let size = parseInt(document.getElementById("dimension").value);
	let cells = document.querySelectorAll("div[id=cell]");
	let popOneColor = document.getElementById("popXcolor").value;
	let popTwoColor = document.getElementById("popYcolor").value;
	
	var x;
	var y;
	for (let i = 0; i < cells.length; i++) {
		x = (i)%size;
		y = Math.floor(i/size);

		//Style the cell accordingly
		if (simBoard[x][y] == 1) {
			cells[i].style.backgroundColor = popOneColor;
		} else if (simBoard[x][y] == 2) {
			cells[i].style.backgroundColor = popTwoColor;
		} else {
			cells[i].style.backgroundColor = "white";
		}
	}
}

/**
 * Returns a list of the indeces of neighboring cells.
 *
 * TODO: Gross! There are better ways to do this. 
 */
function getNeighbors(index, size) {
	// Check to make sure the board isn't too small
	if (size <= 1) {
		return [];
	}
	
	let	x = (index)%size;
	let y = Math.floor(index/size);

//	console.log("X: " + x);
	//console.log("Y: " + y);

	// Holds the indexes of the neighbors
	let neighbors = [];

	//Corner Case -- Very specific. Would be more efficient if checked last
	if (x == 0 && y == 0) {
		// Top left
		//console.log("CornerCase");
		neighbors.push(1);
		neighbors.push(size);
		neighbors.push(size+1);

		//console.log(neighbors);
	} else if (x == 0 && y == size-1) {
		// Bottom left
		neighbors.push(index-size);
		neighbors.push(index-size+1);
		neighbors.push(index+1);
	} else if (x == size-1 && y == 0) {
		// Top right
		neighbors.push(index-1);
		neighbors.push(index+size-1);
		neighbors.push(index+size);
	} else if (x == size-1 && y == size-1) {
		// Bottom right
		neighbors.push(index-size-1);
		neighbors.push(index-size);
		neighbors.push(index-1);
	}
	//Edge Case
	else if (x == 0) {
		//left edge
		neighbors.push(index-size);
		neighbors.push(index-size+1);
		neighbors.push(index+1);
		neighbors.push(index+size);
		neighbors.push(index+size+1);
	} else if (x == size-1) {
		//right edge
		neighbors.push(index-size-1);
		neighbors.push(index-size);
		neighbors.push(index-1);
		neighbors.push(index+size-1);
		neighbors.push(index+size);
	} else if (y == 0) {
		//top edge	
		neighbors.push(index-1);
		neighbors.push(index+1);
		neighbors.push(index+size-1);
		neighbors.push(index+size);
		neighbors.push(index+size+1);
	} else if (y == size-1) {
		//bottom edge	
		neighbors.push(index-1);
		neighbors.push(index+1);
		neighbors.push(index-size-1);
		neighbors.push(index-size);
		neighbors.push(index-size+1);
	}

	// Middle case
	else if (x > 0 && x < size && y > 0 && y < size ) {
		neighbors.push(index-1);
		neighbors.push(index+1);
		neighbors.push(index+size-1);
		neighbors.push(index+size);
		neighbors.push(index+size+1);
		neighbors.push(index-size-1);
		neighbors.push(index-size);
		neighbors.push(index-size+1);
	}
	
	//console.log("getNeighbors is returning: " + neighbors);
	return neighbors;
}

/**
 * Gets the indecies of the free cells.
 *
 * @returns {num[]} freeCells	Indices of free cells
 */
function getFreeCells () {
	let size = parseInt(document.getElementById("dimension").value);

	var freeCellIndices = [];

	for (let i = 0; i < simBoard.length**2; i++) {
		let	x = (i)%size;
		let y = Math.floor(i/size);
		////console.log('x == ' +x);
		//console.log('y == ' +y);
		//console.log();
		if (simBoard[x][y] == 0) {
			freeCellIndices.push(i);
		}
	}
	
	return freeCellIndices;
}

/**
 * Checks if a cell is happy in it's position. 
 * Returns true if the cell is statisfied, false if not. 
 */
function isHappy(index) {
	let size = parseInt(document.getElementById("dimension").value);
	let tolerence = parseFloat(document.getElementById("threshold").value);
	//console.log(index);
	let neighbors = getNeighbors(index, size);

	let xTmp = index%size;
	let yTmp = Math.floor(index/size);
	let type = simBoard[xTmp][yTmp];

	if (type == 0) {
		//console.log("This cell is empty.");
		return true;
	}

	var numSame = 0;	 	
	var numDiff = 0;
	var nType;

	
	//console.log("neighbors :" + neighbors);
	for (let i = 0; i < neighbors.length; i++) {
		let nbr = neighbors[i];	
		//console.log("Checking neighbor: " + nbr);
		let	x = (nbr)%size;
		let y = Math.floor(nbr/size);

		if (simBoard[x][y] == type) {
			//console.log("Same neighbor: " + nbr);
			numSame++;
		} else if (simBoard[x][y] != type && simBoard[x][y] != 0) {
			//console.log("Different neighbor: " + nbr);
			// Filter out empty cells
			numDiff++;
		}
	}

	// Check for divide by zero error
	if (numDiff == 0) {
		return true;
	}
	
	
	var ratio = numSame/(numSame+numDiff);
	//console.log("The ratio is " + ratio);
	if (ratio > tolerence) {
		return true;
	} else {
		return false;
	}
}

/**
 * Runs through each cell in the board, moving unstatisfied cells to a new random free cell. 
 */
function cycleBoard () {
	let size = parseInt(document.getElementById("dimension").value);

	if (getFreeCells().length == 0) {
		return;
	}
	
	var allHappy = true;

	// Go through all the cells in the board
	for(let i = 0; i < size**2; i++) {
		if( !isHappy(i) ) {
			allHappy = false;
		//console.log("Index " + i + " is NOT HAPPY");
		// Swap if not happy
		var freeCells = getFreeCells();
		//console.log("Here are the free locations: " + freeCells);
		//console.log(freeCells.length);
		var target = Math.floor(Math.random()*freeCells.length);
		var newIndex = freeCells[target];
		//console.log("Moving " + i + " to " + newIndex);

		let	xNew = (newIndex)%size;
		let yNew = Math.floor(newIndex/size);
		let	xOld = (i)%size;
		let yOld = Math.floor(i/size);
		simBoard[xNew][yNew] = simBoard[xOld][yOld];
		simBoard[xOld][yOld] = 0;

		}
	}

	generations ++;
	document.querySelector('p').innerHTML = "Generations: " + generations;

	if (allHappy) {
		running = false;
		document.getElementById("runstop").innerHTML = "Run";
	}
	displayBoard();
}

/**
 * Builds both the front end and the back end board based on the values contained in the fields. 
 */
function buildBoard () {
	let size = parseInt(document.getElementById("dimension").value);
	createTable(size);
	initBoard(size);
	displayBoard();
}


/////// EVENT LISTENERS ///////

// Resize board when 'Dimension' changes
let dimension = document.getElementById("dimension");
dimension.addEventListener("change", buildBoard);


let randomize = document.getElementById("randomize");
randomize.addEventListener("click", buildBoard);

let run = document.getElementById("runstop");
run.addEventListener("click", async function(){
	run.innerHTML = "Stop";
	if(running == true) {
		running = false;
	} else {
		running = true;
		while (running) {
			await new Promise((resolve) =>
				setTimeout(() => {
					resolve();
				}, 100)
			);
			cycleBoard();
		}
		run.innerHTML = "Run";
	}
});



// Build board on start up
buildBoard();






