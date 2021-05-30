declare let require: any;

export let version = require('../package.json').version;
export let semver_range = '~' + version;
