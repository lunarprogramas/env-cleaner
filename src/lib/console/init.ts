const colorTable: { [key: string]: { fgc: string; bgc: string } } = {
	['Yellow']: {
		fgc: '\x1b[33m',
		bgc: '\x1b[43m',
	},
	['Green']: {
		fgc: '\x1b[32m',
		bgc: '\x1b[44m',
	},
};

export type Colors = 'Yellow' | 'Green' | 'None';

export async function logToConsole(color: Colors, ...data: any) {
	if (color !== 'None') {
		const colorIndex = colorTable[color];
		console.log(`${colorIndex.fgc}[env-cleaner]: ${data}\x1b[0m`);
	} else {
		console.log(`[env-cleaner]: ${data}`);
	}
}
