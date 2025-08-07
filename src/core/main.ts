import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getenv } from '../lib/getenv/init';
import { packageManager } from '../lib/package/init';
import { RegisteredCommands } from '../types/commands';

export var packageVersion: string = '1.2.2';

const registeredCommands: RegisteredCommands = [
	{
		alias: 'checkEnv',
		description: 'Checks environment files.',
		function: async () => {
			const env = new getenv();
			await env.this();
		},
	},
	{
		alias: 'version',
		description: 'Checks the version and will signal if an update is needed.',
		function: async () => {
			const manager = new packageManager();
			await manager.searchForUpdates();
		},
	},
];

yargs(hideBin(process.argv))
	.command(
		'checkEnv',
		'Checks environment files.',
		() => {},
		async () => {
			const cmd = registeredCommands.find(val => val.alias === 'checkEnv');
			if (cmd) await cmd.function();
		}
	)
	.command(
		'version',
		'Gets the current version of env-cleaner, and checks for updates.',
		() => {},
		async () => {
			const cmd = registeredCommands.find(val => val.alias === 'version');
			if (cmd) await cmd.function();
		}
	)
	.help().argv;
