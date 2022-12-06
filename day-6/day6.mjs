import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

const firstPacketMarkers = /** @type {number[]} */ ([]);
const firstMessageMarkers = /** @type {number[]} */ ([]);

for (const line of lines) {
	if (!line.length) continue;

	// part 1
	const possiblePacketMarker = /** @type {string[]} */ ([]);
	for (let i = 0; i < line.length; i++) {
		possiblePacketMarker[i % 4] = /** @type {string} */ (line[i]);
		if (
			possiblePacketMarker.length === 4 &&
			new Set(possiblePacketMarker).size === 4
		) {
			firstPacketMarkers.push(i + 1);
			break;
		}
	}

	// part 2
	const possibleMessageMarker = /** @type {string[]} */ ([]);
	for (let i = 0; i < line.length; i++) {
		possibleMessageMarker[i % 14] = /** @type {string} */ (line[i]);
		if (
			possibleMessageMarker.length === 14 &&
			new Set(possibleMessageMarker).size === 14
		) {
			firstMessageMarkers.push(i + 1);
			break;
		}
	}
}

console.log(firstPacketMarkers);
console.log(firstMessageMarkers);
