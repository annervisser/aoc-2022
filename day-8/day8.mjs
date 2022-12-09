import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

/** @type {(0|1)[][]} */
const grid = [];
let total = 0;

let lineI = 0;
/** @type {number[]} */
let maxVisiblePerColumn = [];
/** @type {number[][]} */
let columnsYetToParse = [];

for (const line of lines) {
	if(!line.length) continue;
	
	// ltr
	let maxLeft = -1;
	let lastVisibleIndex = -1;

	grid[lineI] = new Array(line.length).fill(0);
	
	for (let i = 0; i < line.length; i++) {
		const tree = parseInt(line[i]);
		if (tree > maxLeft) {
			maxLeft = tree;
			lastVisibleIndex = i;
			addAndCount(lineI, i);
		}

		//ttb
		if (tree > (maxVisiblePerColumn[i] ?? -1)) {
			maxVisiblePerColumn[i] = tree;
			columnsYetToParse[i] = [];
			addAndCount(lineI, i);
		} else {
			columnsYetToParse[i] ??= [];
			columnsYetToParse[i].push(tree);
		}
	}

	// rtl
	let maxRight = -1;
	for (let i = line.length - 1; i > lastVisibleIndex; i--) {
		const tree = parseInt(line[i]);
		if (tree > maxRight) {
			maxRight = tree;
			addAndCount(lineI, i);
		}
	}
	

	lineI++;
}

/**
 * 
 * @param {number} line
 * @param {number} i
 */
function addAndCount(line, i) {
	if ((grid[line][i] ?? 0) === 0) {
		grid[line][i] = 1;
		total++;
	}
}

for (let columnI = 0; columnI < columnsYetToParse.length; columnI++) {
	const column = /** @type {number[]} */ (columnsYetToParse[columnI]);
	let maxBottom = -1;

	let line = grid.length - 1;
	for (let i = column.length - 1; i >= 0; i--) {
		const tree = /** @type {number} */ (column[i]);
		if (tree > maxBottom) {
			maxBottom = tree;
			addAndCount(line, columnI);
		}

		line--;
	}
}


console.log(grid);
console.log(total);
