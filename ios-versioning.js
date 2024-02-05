const {exec} = require('child_process');
const APP_VERSION = process.env.APP_VERSION;
const APPCENTER_BUILD_ID = process.env.APPCENTER_BUILD_ID;

const versionNumber = require('./package.json').version.toLowerCase();
const environment = require('./package.json').environment.toLowerCase();

let version = versionNumber;

if (environment !== 'production' && APPCENTER_BUILD_ID) {
  version = versionNumber + '.' + APPCENTER_BUILD_ID;
} else if (environment !== 'production') {
  version = version + ' - ' + environment;
}

console.log('version', version);

if (APP_VERSION === version) {
  process.exit();
}

exec(
  `/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" "${process.env.TARGET_BUILD_DIR}/${process.env.INFOPLIST_PATH}"`,
  (err, stdout, stderr) => {
    if (err) {
      console.log('Failed to apply the app version.');
      process.exit(1);
    }

    console.log(`Applied app verion: ${version}`);
  },
);
