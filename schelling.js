/**
 * Schelling's Model simulator
 * @author Tyler Weir
 */

// Global Constants
const cell = "<div id='cell'></div>"

// Global Variables
var simBoard; 

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
function displayBoard(size) {
	
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
 * TODO: Need to optimize how searches are made.
 */
function getNeighbors(index, size) {
	// Check to make sure the board isn't too small
	if (size <= 1) {
		return [];
	}
	
	let	x = (index)%size;
	let y = Math.floor(index/size);

	// Holds the indexes of the neighbors
	var neighbors = [];

	//Corner Case -- Very specific. Would be more efficient if checked last
	if (x == 0 && y == 0) {
		// Top left
		neighbors.push(1);
		neighbors.push(size);
		neighbors.push(size+1);
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
	return neighbors;
}




/////// EVENT LISTENERS ///////

// Resize board when 'Dimension' changes
let dimension = document.getElementById("dimension");
dimension.addEventListener("change", function () {
	let size = document.getElementById("dimension").value;
	createTable(size);
	initBoard(size);
	displayBoard(size);
});



// Change population colors

//




