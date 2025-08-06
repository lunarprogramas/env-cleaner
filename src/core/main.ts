import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getenv } from '../lib/getenv/init';

const registeredCommands = [
	{
		alias: 'checkEnv',
		description: 'Checks environment files.',
		function: async () => {
			const env = new getenv();
			await env.this();
		},
	},
];

yargs(hideBin(process.argv))
	.command(
		'checkEnv',
		'Checks environment files.',
		() => {},
		async () => {
			const cmd = registeredCommands.find(c => c.alias === 'checkEnv');
			if (cmd) await cmd.function();
		}
	)
	.help().argv;
