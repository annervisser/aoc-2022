import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

let totalPriority = 0;
let totalTokensPriority = 0;
// /** @type {Map<number, number>} */
let group = [];
for (const line of lines) {
	if (!line.length) continue;
	const lineChars = convertStringToCharArray(line);
	const halfWay = line.length / 2;
	const part1 = lineChars.slice(0, halfWay);
	const part2 = lineChars.slice(halfWay);

	// part 1
	const sharedChar = part1.find((c) => part2.includes(c));
	if (sharedChar === undefined) throw new Error('no matching items');
	totalPriority += priorityOf(sharedChar);

	// part 2
	group.push(lineChars);
	if (group.length === 3) {
		const set2 = new Set(group[1]);
		const set3 = new Set(group[2]);
		const token = group[0]?.find((c) => set2.has(c) && set3.has(c));
		if (token === undefined) throw new Error('no token');
		totalTokensPriority += priorityOf(token);
		group = [];
	}
}

console.log('sum prio shared:', totalPriority);
console.log('sum prio token:', totalTokensPriority);

/**
 * @param {string} string
 * @returns {number[]}
 */
function convertStringToCharArray(string) {
	return string.split('').map((c) => c.charCodeAt(0));
}

/**
 * @param {number} char
 * @returns {number}
 */
function priorityOf(char) {
	const rawPriority = char % 32;
	return char < 96 ? rawPriority + 26 : rawPriority;
}
