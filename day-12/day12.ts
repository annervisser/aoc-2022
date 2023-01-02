import { readFileToLine } from '../utils/read-file';

const lines = readFileToLine('./input.txt');

type Point = readonly [number, number];

// y, x
const grid: number[][] = [];
let start: Point;
let goal: Point;

for (const line of lines) {
	if (!line) continue;

	const row = [];
	for (let char of line) {
		if (char === 'S') {
			start = [row.length, grid.length]; // no -1 because we are in the NEXT row and column
			char = 'a';
		} else if (char === 'E') {
			goal = [row.length, grid.length]; // no -1 because we are in the NEXT row and column
			char = 'z';
		}
		const height = char.charCodeAt(0) - 96; // between 1 and 26
		row.push(height);
	}
	grid.push(row);
}

// @ts-ignore
if (!start || !goal) {
	throw new Error('Start and/or goal not defined');
}

console.log(
	grid.map((l) => l.map((c) => c.toString().padStart(2, '0')).join(' ')),
);
console.log(`grid is ${grid[0]!.length} x ${grid.length}`);
console.log(`Moving from <${start!.join(', ')}> to <${goal!.join(', ')}>`);

const goalStr = goal.toString();
const routeToGoal = dijktra(
	start,
	(p) => p.toString() === goalStr,
	(currentHeight, destHeight) => destHeight - currentHeight <= 1,
);
console.log(`Part 1: Path (${routeToGoal.length}): ${routeToGoal.join(' > ')}`);

const routeFromGoal = dijktra(
	goal,
	(p) => getHeightAtPoint(p) === 1,
	(currentHeight, destHeight) => currentHeight - destHeight <= 1, // reverse
);
console.log(
	`Part 2: Path (${routeFromGoal.length}): ${routeFromGoal.join(' > ')}`,
);

function dijktra(
	start: Point,
	isGoal: (p: Point) => boolean,
	canReach: (currentHeight: number, destHeight: number) => boolean,
): Point[] {
	const frontier: Point[][] = [[start]];
	const cameFrom: Record<string, Point> = { [start.toString()]: start };
	const cost: Record<string, number> = { [start.toString()]: 0 };

	while (frontier.length) {
		const squaresWithLowestPrio = frontier.pop();

		for (const current of squaresWithLowestPrio ?? []) {
			const currentCost = cost[current.toString()]!;
			const neighbours = getNeighbours(current, canReach);

			for (const next of neighbours) {
				const newCost = currentCost + 1;
				const nextStr = next.toString();
				const nextCost = cost[nextStr];
				if (nextCost !== undefined && newCost >= nextCost) continue;
				(frontier[newCost] ??= []).push(next);
				cost[nextStr] = newCost;
				cameFrom[nextStr] = current;
				if (isGoal(next)) return backTrack(start, next, cameFrom);
			}
		}
	}
	throw new Error('No path found');
}

function backTrack(
	start: Point,
	goal: Point,
	visited: Record<string, Point>,
): Point[] {
	let current = goal;
	const path: Point[] = [];
	while (current.toString() !== start.toString()) {
		path.push(current);
		current = visited[current.toString()]!;
	}
	return path.reverse();
}

function getNeighbours(
	point: Point,
	canReach: (currentHeight: number, destHeight: number) => boolean,
): Point[] {
	const currentHeight = getHeightAtPoint(point)!;
	const options: Point[] = [
		[point[0], point[1] - 1],
		[point[0], point[1] + 1],
		[point[0] - 1, point[1]],
		[point[0] + 1, point[1]],
	];
	return options.filter((option) => {
		const optionHeight = getHeightAtPoint(option);
		return optionHeight !== null && canReach(currentHeight, optionHeight);
	});
}

function getHeightAtPoint(point: Point): number | null {
	return grid[point[1]]?.[point[0]] ?? null;
}
