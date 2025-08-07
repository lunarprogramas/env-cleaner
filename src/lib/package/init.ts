import axios from 'axios';
import { packageVersion } from '../../core/main';
import { logToConsole } from '../../lib/console/init';

export class packageManager {
	async searchForUpdates(): Promise<boolean> {
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

		// run an arithmetic operation to determine if the version numbers truely are what they say
		let versionNumber: string | number = latestVersionNo.replace('.', '');
		versionNumber = parseInt(versionNumber);

		let currentVersionNumber: string | number = packageVersion.replace('.', '');
		currentVersionNumber = parseInt(currentVersionNumber);

		if (versionNumber > currentVersionNumber) {
			logToConsole(
				'Yellow',
				`There is an update available! (${packageVersion} -> ${latestVersionNo}) Run npm update env-cleaner to get the latest version.`
			);
			return true;
		} else if (currentVersionNumber > versionNumber) {
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
