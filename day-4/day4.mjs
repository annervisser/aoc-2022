import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

/** @typedef {[number, number]} Pair */

let fullyOverlapping = 0;
let overlapping = 0;
for (const line of lines) {
	if (!line.length) continue;

	const pairs = line
		.split(',')
		.map((p) => p.split('-').map((n) => parseInt(n)));
	const [p1, p2] = /** @type {[Pair, Pair]} */ (pairs);
	const d1 = p1[1] - p1[0];
	const d2 = p2[1] - p2[0];

	// day 1
	const [smaller, bigger] = d1 <= d2 ? [p1, p2] : [p2, p1];
	if (smaller[0] >= bigger[0] && smaller[1] <= bigger[1]) {
		fullyOverlapping++;
	}

	// day 2
	if (p1[1] >= p2[0] && p1[0] <= p2[1]) {
		overlapping++;
	}
}

console.log('fully overlapping:', fullyOverlapping);
console.log('overlapping:', overlapping);
