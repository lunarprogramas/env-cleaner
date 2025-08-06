import { getenv } from '@lib/getenv/init';
import readline from 'readline';

const registeredCommands: {
	commandName: string;
	commandDescription: string;
	alias: string;
	arguments: number;
	function: Function;
}[] = [];

const startTable = [
	{
		name: 'NeuralNetwork',
		class: new getenv(),
		commands: [
			{
				name: 'Ask NeuralNetwork',
				alias: 'ask',
				arguments: 1,
				description: 'Asks NeuralNetwork a question.',
				callbackFunction: new getenv().this,
			},
		],
	},
];

function start() {
	(async () => {
		console.log('performing async start');
		// start stuff here
		for (const module of startTable) {
			console.log('starting module ', module.name);
			const startClass = module.class;

			// register commands
			if (module.commands.length > 0) {
				for (const command of module.commands) {
					const data = {
						commandName: command.name,
						commandDescription: command.description,
						alias: command.alias,
						arguments: command.arguments,
						function: command.callbackFunction,
					};

					console.log(`[${module.name}] > Command ${command.name} registered!`);
					registeredCommands.push(data);
				}
			}

			if (startClass && startClass.startModule && typeof startClass.startModule == 'function') {
				await startClass.startModule();
				console.log('started ', module.name);
			}
		}

		// readline stuff
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			prompt: '> ',
		});

		// handle commands
		rl.on('line', async line => {
			switch (line.toLowerCase()) {
				default:
					for (const command of registeredCommands) {
						if (line.includes(' ')) {
							const split = line.trim().split(' ');
							const cmdName = split[0]; // "ask"
							const args = split.slice(1).join(' '); // "how are you?"

							if (command.alias === cmdName) {
								return await command.function(args); // pass all remaining as one string
							}
						} else {
							if (command.alias === line) {
								return await command.function();
							}
						}
					}

					return console.log('unknown command!');
				case 'exit':
					rl.close();
					process.exit(0);
				case 'help':
					const output: string[] = [];
					for (const cmd of registeredCommands) {
						output.push(
							`${cmd.alias} - ${cmd.commandDescription} [ARGUMENTS: ${cmd.arguments}]`
						);
					}
					console.log(output.join('\n'));
			}
		});
		console.log('now listening to commands in terminal window!');

		console.log('finished loading!');
	})();
}

start();
