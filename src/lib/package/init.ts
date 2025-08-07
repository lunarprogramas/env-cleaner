import axios from 'axios';
import { packageVersion } from '../../core/main';
import { logToConsole } from '../../lib/console/init';

export class packageManager {
	async searchForUpdates(): Promise<boolean> {
		async function compareVersions(a: string, b: string): Promise<number> {
			const previous = a.split('.').map(Number);
			const current = b.split('.').map(Number);

			let currentN: string = '';
			let previousN: string = '';

			for (const n of previous) {
				previousN = previousN + n.toString();
			}

			for (const n of current) {
				currentN = currentN + n.toString();
			}

			if (parseInt(previousN) > parseInt(currentN)) {
				return -1;
			} else if (parseInt(currentN) > parseInt(previousN)) {
				return 1;
			}

			return 0;
		}

		logToConsole('Green', 'Searching for updates...');
		const request = await axios({
			url: 'https://api.github.com/repos/lunarprogramas/env-cleaner/releases/latest',
			method: 'GET',
		});

		const latestVersionNo: string = (request.data && request.data['name']) ?? false;

		if (!latestVersionNo) {
			logToConsole('Yellow', 'Failed to fetch the latest version from GitHub.');
			return false;
		}

		if (
			request.data &&
			request.data['author'] &&
			request.data['author'].login !== 'lunarprogramas'
		) {
			// safetey check to prevent non-authors from being able to trigger updates
			logToConsole(
				'Yellow',
				`The latest package (${latestVersionNo}) published is not from the author of this package.`
			);

			return false;
		}

		const versionComparison: number = await compareVersions(packageVersion, latestVersionNo);

		if (versionComparison === 1) {
			logToConsole(
				'Yellow',
				`There is an update available! (${packageVersion} -> ${latestVersionNo}) Run npm update env-cleaner to get the latest version.`
			);
			return true;
		} else if (versionComparison === -1) {
			logToConsole(
				'Yellow',
				`This package is either deprecated or the github is seriously outdated.`
			);
			return false;
		}

		logToConsole(
			'None',
			`Current package version: ${packageVersion}. There are no updates currently available.`
		);
		return false;
	}
}
