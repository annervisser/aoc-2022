import { readFileToLine } from '../utils/read-file.mjs';
import { sum } from '../utils/sum.mjs';

const lines = readFileToLine('./input.txt');

/** @type {Record<string, number>} */
const sizeMap = {};
/** @type {string[]} */
const path = [];

for (const line of lines) {
	if (!line.length) continue;

	if (line.startsWith('$ ls') || line.startsWith('dir')) {
		continue;
	}

	if (line.startsWith('$ cd')) {
		const dirName = line.slice(5);
		if (dirName !== '..') {
			path.push(dirName);
			sizeMap[path.join('/')] = 0;
		} else {
			traverseUp();
		}
		continue;
	}

	const [size, _file] = /** @type {[string, string]} */ (line.split(' '));
	sizeMap[path.join('/')] += parseInt(size);
}

// go back up the tree from wherever the commands left is, to finish the totals
while (path.length > 1) {
	traverseUp();
}

function traverseUp() {
	const prevSize = /** @type {number} */ (sizeMap[path.join('/')]);
	path.pop();
	sizeMap[path.join('/')] += prevSize; // increase parent dir by our size
}

console.log(sizeMap);
// part 1
const sizes = Object.values(sizeMap);
console.log('part 1:', sum(sizes.filter((s) => s < 100_000)));

// part 2
const FS_SIZE = 70_000_000;
const REQUIRED_SPACE = 30_000_000;

const usedSpace = /** @type {number} */ (sizeMap['/']);
const freeSpace = FS_SIZE - usedSpace;
const needToClear = REQUIRED_SPACE - freeSpace;
sizes.sort((a, b) => a - b);
const smallestDeletionCandidate = sizes.find((d) => d >= needToClear);
console.log('part 2:', smallestDeletionCandidate);
