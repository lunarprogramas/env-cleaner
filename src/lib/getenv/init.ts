import { readFileSync, writeFileSync } from 'fs';
import path, { resolve } from 'path';
import { envValues } from '../../types/env-values';
import { exampleEnvValues } from '../../types/example-env-values';
import { logToConsole } from '../console/init';

export class getenv {
	async this() {
		async function retrieveEnvFile(): Promise<boolean | envValues> {
			// retrieves the .env file from the base directory
			const rootdir = path.join('./');
			let resolveFile = resolve(rootdir, '.env');
			let envContents;
			let values: envValues = [];

			if (resolveFile) {
				envContents = readFileSync(resolveFile);
				let string = envContents.toString('base64');
				string = atob(string); // converts from base64 to a readable string
				const seperate = string.split(`\n`);

				for (let s of seperate) {
					const seperator = s.split(`=`);
					let name = seperator[0];
					name = name.replace(`\n`, '');
					values.push({ name: name, value: seperator[1] });
					continue;
				}
			} else {
				return false;
			}

			return values;
		}

		async function retrieveEnvExampleFile(): Promise<boolean | exampleEnvValues> {
			// retrieves the .example.env file from the base directory
			const rootdir = path.join('./');
			let resolveFile = resolve(rootdir, '.example.env');
			let envContents;
			let values: exampleEnvValues = [];

			if (resolveFile) {
				try {
					envContents = readFileSync(resolveFile);
					let string = envContents.toString('base64');
					string = atob(string); // converts from base64 to a readable string
					const seperate = string.split(`\n`);

					for (var s of seperate) {
						const seperator = s.split(`=`);
						let name = seperator[0];
						name = name.replace(`\n`, '');
						values.push({ name: name });
						continue;
					}
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}

			return values;
		}

		async function writeToEnvFile(data: exampleEnvValues, currentValues: envValues) {
			// writes to the .env file
			for (const value of data) {
				currentValues.push({ name: value.name, value: '' });
				continue;
			}

			const rootdir = path.join('./');
			const envFile = resolve(rootdir, '.env');
			const dataToWrite: string[] = [];

			for (const value of currentValues) {
				dataToWrite.push(value.name + `=` + value.value);
				continue;
			}

			writeFileSync(envFile, dataToWrite.join(`\n`));
			logToConsole('Green', 'Updated your .env file with the missing values.');
		}

		async function writeToExampleEnvFile(data: exampleEnvValues, currentValues: envValues) {
			// writes to the .example.env file
			for (const value of data) {
				currentValues.push({ name: value.name, value: '' });
				continue;
			}

			const rootdir = path.join('./');
			const envFile = resolve(rootdir, '.example.env');
			const dataToWrite: string[] = [];

			for (const value of currentValues) {
				dataToWrite.push(value.name + `=`);
				continue;
			}

			writeFileSync(envFile, dataToWrite.join(`\n`));
			logToConsole('Green', 'Updated your .example.env file with the missing values.');
		}

		async function searchEnvForMissingValues(
			envValues: any[],
			exampleEnvValues: any[],
			fileOperation?: string
		) {
			// performs a search on the .env file for any missing values from the .example.env file
			const output: exampleEnvValues = [];
			const index_env: string[] = [];
			const index_env_example: string[] = [];

			if (!fileOperation) fileOperation = '.example.env';

			for (const envVal of envValues) {
				index_env.push(envVal.name);
			}

			for (const envVal of exampleEnvValues) {
				index_env_example.push(envVal.name);
			}

			if (fileOperation === '.example.env') {
				for (const val of index_env_example) {
					if (!index_env.includes(val)) {
						output.push({ name: val });
						logToConsole(
							'Yellow',
							`${val} has been found in .example.env but not in your .env file.`
						);
					}
				}
			} else if (fileOperation === '.env') {
				for (const val of index_env) {
					if (!index_env_example.includes(val)) {
						output.push({ name: val });
						logToConsole(
							'Yellow',
							`${val} has been found in .env but not in your .example.env file.`
						);
					}
				}
			}

			if (output.length > 0) {
				if (fileOperation === '.example.env') {
					writeToEnvFile(output, envValues);
				} else if (fileOperation === '.env') {
					writeToExampleEnvFile(output, exampleEnvValues);
				} else {
					return logToConsole('None', `Invalid file operation specified.`);
				}
			} else {
				logToConsole(
					'Green',
					`Everything seems to be up-to-date on: ${
						fileOperation === '.env' ? '.example.env' : '.env' // for some dumb reason it does not do it the way intended so I have to inverse it for it work
					}.`
				);
			}
		}

		async function createExampleEnvFile(envValues: envValues) {
			// creates you an .example.env file based on your values from your .env value
			const rootdir = path.join('./');
			let string: string = ``;
			for (const data of envValues) {
				string = string + `${data.name}=\n`;
				continue;
			}

			const fileToPath = resolve(rootdir, '.example.env');
			writeFileSync(fileToPath, string);
			logToConsole('Green', 'Created you an .example.env file in your base directory.');
		}

		const envFile = await retrieveEnvFile();
		if (typeof envFile == 'boolean') {
			return logToConsole('Yellow', 'Unable to retrieve .env file.');
		}

		const exampleEnv = await retrieveEnvExampleFile();
		if (typeof exampleEnv == 'boolean') {
			await createExampleEnvFile(envFile);
		} else {
			await searchEnvForMissingValues(envFile, exampleEnv);
			// perform a search on your .example.env file for any missing values
			await searchEnvForMissingValues(envFile, exampleEnv, '.env');
		}
	}

	async startModule() {}
}
