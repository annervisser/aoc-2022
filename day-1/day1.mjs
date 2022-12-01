import {readFileToLine} from "../utils/read-file.mjs";

const lines = readFileToLine('./input.txt');


let currentElf = 0;
const elves = [];
for (const line of lines) {
    if (line.trim().length < 1) {
        elves.push(currentElf);
        currentElf = 0;
        continue;
    }

    currentElf += parseInt(line);
}

elves.sort((a, b) => b - a);
const topThree = elves.slice(0, 3);

console.log('Day 1');
console.log('---------------------------');
console.log('Max elf:', elves.at(0));
console.log();

console.log('Day 2');
console.log('---------------------------');
console.log('Top 3:', topThree.map((n, i) => `${i + 1}: ${n}`).join(' | '));
console.log('Sum of top 3', topThree.reduce((acc, cur) => acc + cur));
