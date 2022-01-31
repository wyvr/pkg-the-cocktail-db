const { Storage } = require('@lib/storage');
const time_helper = require('@lib/converter/time');

const log = require('./_log');

module.exports = async (db_name, data, get_key) => {
    if (typeof get_key != 'function') {
        log.error(`missing get_key fn for table "${db_name}"`);
        return false;
    }
    if (!Array.isArray(data) || data.length == 0) {
        log.warning(`empty data for table "${db_name}"`);
        return false;
    }
    await Storage.setup();
    const hr_start = process.hrtime();

    // create db
    await Storage.db.exec(`CREATE TABLE IF NOT EXISTS ${db_name} (
            key VARCHAR(255) NOT NULL PRIMARY KEY,
            value TEXT
            );`);
    let counter = data.length - 1;
    while (counter >= 0) {
        const entry = data[counter];
        await Storage.set(
            db_name,
            get_key(entry),
            entry
        );
        counter--;
    }
    return {
        amount: data.length,
        duration: Math.ceil(time_helper.hrtime_to_ms(process.hrtime(hr_start))),
    };
};
