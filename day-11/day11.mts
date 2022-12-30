import { readFileToLine } from '../utils/read-file.mjs';

class Monkey {
	constructor(
		public readonly items: number[],
		public readonly operation: (worry: number) => number,
		public readonly test: (worry: number) => boolean,
		public readonly trueMonkey: number,
		public readonly falseMonkey: number,
	) {}

	public static fromInput(data: {
		items: string;
		operation: string;
		test: string;
		true: string;
		false: string;
	}) {
		const operation = `return ${data.operation.slice('new = '.length)};`;
		const shouldBeDivisibleBy = parseInt(
			data.test.slice('divisible by '.length),
		);
		return new Monkey(
			data.items.split(', ').map((n) => parseInt(n)),
			(old: number) => Function('old', operation)(old),
			(worry: number) => worry % shouldBeDivisibleBy === 0,
			parseInt(data.true.slice('throw to monkey '.length)),
			parseInt(data.false.slice('throw to monkey '.length)),
		);
	}
}

const lines = readFileToLine('./input.txt');

let monkeys = [];
let current: Record<string, string> = {};

for (const line of lines) {
	if (!line) {
		monkeys.push(Monkey.fromInput(current as any));
		current = {};
		continue;
	}
	if (line.startsWith('Monkey')) {
		continue;
	}

	const [key, value] = line.split(': ') as [string, string];
	current[key.toLowerCase().split(' ').at(-1)!] = value;
}

const monkeyInspections = new Map<number, number>();
for (let i = 0; i < 20; i++) {
	for (const monkey of monkeys) {
		const monkeyIndex = monkeys.indexOf(monkey);
		console.log(`Monkey ${monkeyIndex}:`);
		while (monkey.items.length) {
			const item = monkey.items.shift()!;
			console.log(
				`  Monkey inspects an item with a worry level of ${item}.`,
			);
			monkeyInspections.set(
				monkeyIndex,
				(monkeyInspections.get(monkeyIndex) ?? 0) + 1,
			);
			let worry = monkey.operation(item);
			console.log(`    Worry level is multiplied by xx to ${worry}.`);

			worry = Math.floor(worry / 3);
			console.log(
				`    Monkey gets bored with item. Worry level is divided by 3 to ${worry}.`,
			);

			const isDivisible = monkey.test(worry);
			console.log(
				`    Current worry level is ${
					isDivisible ? '' : 'not '
				}divisible by xx.`,
			);

			const throwTo = isDivisible
				? monkey.trueMonkey
				: monkey.falseMonkey;
			console.log(
				`    Item with worry level ${worry} is thrown to monkey ${throwTo}.`,
			);
			monkeys[throwTo]!.items.push(worry);
		}
	}

	console.log('');
	for (const monkey of monkeys) {
		console.log(
			`Monkey ${monkeys.indexOf(monkey)}: ${monkey.items.join(', ')}`,
		);
	}
	console.log('');
}

console.log(monkeyInspections);
console.log(
	Array.from(monkeyInspections.values())
		.sort((a, b) => b - a)
		.slice(0, 2)
		.reduce((acc, cur) => acc * cur),
);
