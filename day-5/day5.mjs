import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

/** @type {Record<string, string[]>} */
const part1Stacks = {};
/** @type {Record<string, string[]>} */
const part2Stacks = {};

while (true) {
	const line = /** @type {string} */ (lines.shift());
	for (let i = 0; i < line.length / 4; i++) {
		let item = line[i * 4 + 1];
		if (item?.trim()?.length) {
			// stacks are 1-indexed
			(part1Stacks[i + 1] ??= []).push(item);
			(part2Stacks[i + 1] ??= []).push(item);
		}
	}
	// the columns have numbers under them, we currently have those as items because it doesn't matter
	if (!line.length) break;
}

console.log(part1Stacks);
for (const line of lines) {
	if (!line.length) continue;

	const {
		n: amountString,
		from,
		to,
	} = /** @type {{n: string, from: string, to: string}} */ (
		line.match(/move (?<n>\d+) from (?<from>\d+) to (?<to>\d+)/)?.groups
	);

	const amount = parseInt(amountString);
	for (let i = 0; i < amount; i++) {
		const item = /** @type {string} */ (part1Stacks[from]?.shift());
		part1Stacks[to]?.unshift(item);
	}

	const moving = /** @type {string[]} */ (
		part2Stacks[from]?.splice(0, amount)
	);
	part2Stacks[to]?.unshift(...moving);
}

console.log('part 1 stacks', part1Stacks);
console.log('part 2 stacks', part2Stacks);
console.log('part 1:', getTopItems(part1Stacks));
console.log('part 2:', getTopItems(part2Stacks));

/**
 *
 * @param {Record<string, string[]>} stacks
 * @returns {string}
 */
function getTopItems(stacks) {
	return Object.values(stacks).reduce((acc, cur) => acc + cur[0], '');
}
