import { readFileToLine } from '../utils/read-file.mjs';

class Point {
	constructor(public readonly x: number, public readonly y: number) {}

	public add(other: Point): Point {
		return new Point(this.x + other.x, this.y + other.y);
	}

	public difference(other: Point): Point {
		return new Point(
			Math.abs(this.x - other.x),
			Math.abs(this.y - other.y),
		);
	}

	/**
	 * Return a point with both coordinates being either -1, 0 or 1
	 */
	public direction(other: Point): Point {
		const deltaX = other.x - this.x;
		const deltaY = other.y - this.y;
		return new Point(
			deltaX !== 0 ? deltaX / Math.abs(deltaX) : 0,
			deltaY !== 0 ? deltaY / Math.abs(deltaY) : 0,
		);
	}

	public equals(other: Point): boolean {
		return this.x === other.x && this.y === other.y;
	}

	public min(other: Point): Point {
		return new Point(Math.min(this.x, other.x), Math.min(this.y, other.y));
	}

	public max(other: Point): Point {
		return new Point(Math.max(this.x, other.x), Math.max(this.y, other.y));
	}

	public toString() {
		return `<${this.x}, ${this.y}>`;
	}
}

type Direction = 'U' | 'D' | 'L' | 'R';
// type Point = readonly [number, number];
const directions: Record<Direction, Point> = {
	U: new Point(0, -1),
	D: new Point(0, 1),
	L: new Point(-1, 0),
	R: new Point(1, 0),
};

const startPoint = new Point(0, 0);

function run(file: string, snakeSize: number, debug: boolean = false) {
	const lines = readFileToLine(file);

	const visited = new Set<string>();
	visited.add(startPoint.toString());
	const snake: Point[] = new Array(snakeSize).fill(startPoint);

	if (debug) {
		console.log('== Initial State ==\n');
		draw(snake);
	}

	for (const line of lines) {
		if (!line) continue;
		const [direction, stepsString] = line.split(' ') as [Direction, string];
		const steps = parseInt(stepsString, 10);
		debug && console.log(`== ${direction} ${steps} ==\n`);

		for (let step = 0; step < steps; step++) {
			snake[0] = move(snake[0]!, direction);
			let item: Point;
			for (let i = 1; i < snake.length; i++) {
				item = snake[i]!;
				snake[i] = follow(item, snake[i - 1]!);
			}
			visited.add(snake.at(-1)!.toString());

			debug && draw(snake);
		}
	}

	console.log(`Tail visited ${visited.size} locations`);
}

function draw(snake: Point[]): void {
	const min = [startPoint, ...snake].reduce((acc, cur) => acc.min(cur));
	const max = [startPoint, ...snake].reduce((acc, cur) => acc.max(cur));

	for (let y = min.y; y <= max.y; y++) {
		let line = '';
		for (let x = min.x; x <= max.x; x++) {
			const gridPoint = new Point(x, y);
			if (snake.at(0)?.equals(gridPoint)) {
				line += 'H';
			} else if (snake.at(-1)?.equals(gridPoint)) {
				line += 'T';
			} else if (snake.some((p) => p.equals(gridPoint))) {
				line += 'X';
			} else if (startPoint.equals(gridPoint)) {
				line += 's';
			} else {
				line += '.';
			}
		}
		console.log(line);
	}
	console.log('');
}

function move(point: Point, direction: Direction): Point {
	return point.add(directions[direction]);
}

function follow(point: Point, follow: Point): Point {
	// console.log(`point ${point} follow ${follow}`);
	const difference = point.difference(follow);
	const direction = point.direction(follow);
	// console.log(`diff: ${difference} | dir: ${direction}`);
	let moved = point;
	if (difference.x > 1 || difference.y > 1) {
		moved = moved.add(new Point(direction.x, direction.y));
	}

	return moved;
}

console.log('Part 1 - example 1');
run('input-example.txt', 2);
console.log('Part 1');
run('input.txt', 2);

console.log('');
console.log('Part 2 - example 1');
run('input-example.txt', 10);
console.log('Part 2 - example 2');
run('input-example-part2.txt', 10);
console.log('Part 2');
run('input.txt', 10);
