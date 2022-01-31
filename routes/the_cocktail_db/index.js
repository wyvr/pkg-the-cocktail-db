const time_helper = require('@lib/converter/time');

const config_keys = require('./resources/_config_keys');
const log = require('./logic/_log');
const load_categories = require('./logic/_load_categories');
const load_drinks = require('./logic/_load_drinks');
const load_drinks_detail = require('./logic/_load_drinks_detail');
const transform = require('./logic/_transform');
const { Config } = require('@lib/config');
const { EnvType } = require('@lib/struc/env');
const { Dir } = require('@lib/dir');
const { join } = require('path');

module.exports = async ({initial, env}) => {
    if(initial && env == EnvType.prod) {
        const cache_dir = join(process.cwd(), 'cache', config_keys.name);
        log.warning(`destroy caches in ${cache_dir} for prod env`);
        Dir.delete(cache_dir)
    }
    const start = process.hrtime();
    let config = Config.get(config_keys.name);
    if (!config) {
        log.warning(
            `You should put the following inside your wyvr.js config file to use this package correct\ne.g. {\n  ${config_keys.name}: {\n    api_key: '<your_api_key>'\n  }\n}`
        );
        config = { api_key: '1' };
    }

    log.info('api_key', config.api_key == '1' ? 'free' : 'eventually paid');

    const start_categories = process.hrtime();
    const categories = await load_categories(config.api_key);
    log.info(
        `${categories.length} categories in ${Math.ceil(
            time_helper.hrtime_to_ms(process.hrtime(start_categories))
        )} ms`
    );

    const start_drinks = process.hrtime();
    const drinks = await load_drinks(config.api_key, categories);
    log.info(drinks.length, 'drinks from categories');

    const drinks_detail = await load_drinks_detail(config.api_key, drinks);
    log.info(
        `${drinks_detail.length} drinks in ${Math.ceil(
            time_helper.hrtime_to_ms(process.hrtime(start_drinks))
        )} ms`
    );

    const start_transform = process.hrtime();
    const result = await transform(categories, drinks_detail);
    log.info(
        `${result.length} pages transformed in ${Math.ceil(
            time_helper.hrtime_to_ms(process.hrtime(start_transform))
        )} ms`
    );



    log.info(
        `done in ${Math.ceil(
            time_helper.hrtime_to_ms(process.hrtime(start))
        )} ms`
    );

    return result;
};