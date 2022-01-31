const { request } = require('@lib/helper/request');
const { read_cache, write_cache } = require('@lib/helper/cache');
const log = require('./_log');
const { join } = require('path');

const config_keys = require('../resources/_config_keys');

module.exports = async (api_key, categories) => {
    if (!api_key) {
        return [];
    }
    const cache_file = join(config_keys.name, 'drinks.json');
    // read from cache
    const from_cache = read_cache(cache_file);
    if (from_cache) {
        log.improve('load drinks from cache', cache_file);
        return from_cache;
    }

    // load from external
    const result = [],
        len = categories.length;
    let index = 0;
    while (index < len) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const category = categories[index];
        index++;
        log.debug('load drinks from category', category);
        const [error, cat_result] = await request(
            `${config_keys.root_url}/${api_key}/filter.php?c=${category.replace(/\s/g, '_')}`
        );
        if (error) {
            log.error('load drinks from category', category, error);
            continue;
        }
        if (!Array.isArray(cat_result.drinks)) {
            log.error('load drinks from category, wrong result', cat_result);
            continue;
        }
        result.push(cat_result.drinks);
    }

    const drinks = result.reduce((acc, cur) => [].concat(acc, cur), []);
    // store in cache_file
    write_cache(cache_file, drinks);
    return drinks;
};
