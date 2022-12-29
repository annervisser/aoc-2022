import { readFileToLine } from '../utils/read-file.mjs';

const lines = readFileToLine('./input.txt');

let cycles = 0;
let x = 1;
let output = '';
let log = new Map<number, number>();

for (const line of lines) {
	if (!line) continue;

	const [command, ...args] = line.split(' ');
	switch (command) {
		case 'noop':
			cycle();
			break;
		case 'addx':
			cycle();
			cycle();
			x += parseInt(args[0]!);
			break;
		default:
			throw new Error('unknown cmd');
	}
}

function cycle() {
	cycles++;
	log.set(cycles, x);
	const pixel = (cycles - 1) % 40; // zero based
	if (Math.abs(pixel - (x % 40)) <= 1) {
		output += '█';
	} else {
		output += '.';
	}
}

let sum = 0;
for (const cycleI of [20, 60, 100, 140, 180, 220]) {
	sum += log.get(cycleI)! * cycleI;
}

console.log('Part 1:');
console.log(sum);

console.log('');
console.log('Part 2:');
for (let i = 0; i <= output.length - 40; i += 40) {
	console.log(output.slice(i, i + 40));
}
