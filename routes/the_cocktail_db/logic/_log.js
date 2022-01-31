const { LogType } = require('@lib/struc/log');
const { Logger } = require('@lib/logger');
const keys = require('../resources/_config_keys');


function combine(...messages) {
    return [Logger.color.dim(`[${keys.display_name}]`), ...messages.map(Logger.stringify)].join(' ');
}
module.exports = {
    debug: (...messages) => {
        Logger.debug(combine(...messages));
    },
    info: (...messages) => {
        Logger.info(combine(...messages));
    },
    error: (...messages) => {
        Logger.error(combine(...messages));
    },
    improve: (...messages) => {
        Logger.improve(combine(...messages));
    },
    warning: (...messages) => {
        Logger.warning(combine(...messages));
    },
    color: Logger.color
};
