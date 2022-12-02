import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

/**
 * @typedef {0|1|2} Move
 * @typedef {0|1|2} TargetResult
 */

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const LOSE = 0;
const DRAW = 1;
const WIN = 2;

/** @type {Record<Move, number>} */
const movePoints = {
	[ROCK]: 1,
	[PAPER]: 2,
	[SCISSORS]: 3,
};
let scoreWhenMove = 0;
let scoreWhenTarget = 0;
for (const line of lines) {
	if (!line.length) continue;
	const [opMoveString, myMoveString] =
		/** @type [('A'|'B'|'C'), ('X'|'Y'|'Z')] */ (line.split(' '));
	const opMove = /** @type {Move} */ (['A', 'B', 'C'].indexOf(opMoveString));
	const myMove = /** @type {Move} */ (['X', 'Y', 'Z'].indexOf(myMoveString));

	scoreWhenMove += getScore(opMove, myMove);
	scoreWhenTarget += getScore(opMove, moveTo(opMove, myMove));
}

console.log('scores second column = my move', scoreWhenMove);
console.log('scores second column = target result', scoreWhenTarget);

/**
 * @param {Move} opMove
 * @param {Move} myMove
 * @returns {number}
 */
function getScore(opMove, myMove) {
	let score = 0;
	score += movePoints[myMove];
	const winner = whoWins(opMove, myMove);
	if (winner === 0) {
		// draw
		score += 3;
	}
	if (winner > 0) {
		// we win
		score += 6;
	}
	return score;
}

/**
 * @param {Move} a
 * @param {Move} b
 * @return {number}
 */
function whoWins(a, b) {
	const diff = a - b;
	return diff % 2 === 0 ? diff : -diff;
}

// Test whoWins
// console.log(whoWins(ROCK, ROCK), whoWins(ROCK, ROCK) === 0);
// console.log(whoWins(ROCK, PAPER), whoWins(ROCK, PAPER) > 0);
// console.log(whoWins(ROCK, SCISSORS), whoWins(ROCK, SCISSORS) < 0);
// console.log(whoWins(PAPER, ROCK), whoWins(PAPER, ROCK) < 0);
// console.log(whoWins(PAPER, PAPER), whoWins(PAPER, PAPER) === 0);
// console.log(whoWins(PAPER, SCISSORS), whoWins(PAPER, SCISSORS) > 0);
// console.log(whoWins(SCISSORS, ROCK), whoWins(SCISSORS, ROCK) > 0);
// console.log(whoWins(SCISSORS, PAPER), whoWins(SCISSORS, PAPER) < 0);
// console.log(whoWins(SCISSORS, SCISSORS), whoWins(SCISSORS, SCISSORS) === 0);

/**
 * @param {Move} opMove
 * @param {TargetResult} targetResult
 * @returns {Move}
 */
function moveTo(opMove, targetResult) {
	/** @type {number} */
	let move;
	switch (targetResult) {
		case DRAW:
			move = opMove;
			break;
		case LOSE:
			move = opMove + 2;
			break;
		case WIN:
			move = opMove + 1;
			break;
	}

	return /** @type {Move} */ (move % 3);
}

// test moveTo
// console.log(moveTo(ROCK, LOSE) === SCISSORS);
// console.log(moveTo(ROCK, DRAW) === ROCK);
// console.log(moveTo(ROCK, WIN) === PAPER);
// console.log(moveTo(PAPER, LOSE) === ROCK);
// console.log(moveTo(PAPER, DRAW) === PAPER);
// console.log(moveTo(PAPER, WIN) === SCISSORS);
// console.log(moveTo(SCISSORS, LOSE) === PAPER);
// console.log(moveTo(SCISSORS, DRAW) === SCISSORS);
// console.log(moveTo(SCISSORS, WIN) === ROCK);
