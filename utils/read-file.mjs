import fs from "fs";


/**
 * @param {string} filePath
 * @returns {string[]}
 */
export function readFileToLine(filePath) {
    const input = fs.readFileSync(filePath);
    const inputString = input.toString();
    return inputString.split('\n');
}
