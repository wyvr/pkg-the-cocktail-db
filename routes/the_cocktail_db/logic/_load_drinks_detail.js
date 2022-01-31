const { request } = require('@lib/helper/request');
const { read_cache, write_cache } = require('@lib/helper/cache');
const log = require('./_log');
const { join } = require('path');

const config_keys = require('../resources/_config_keys');

module.exports = async (api_key, drinks) => {
    if (!api_key) {
        return [];
    }
    // read from cache
    const cache_file = join(config_keys.name, 'drinks_detail.json');
    const from_cache = read_cache(cache_file);
    if (from_cache) {
        log.improve('load detailed drinks from cache', cache_file);
        return from_cache;
    }

    // load from external
    const result = [],
        len = drinks.length;
    let index = 0;
    while (index < len) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const drink = drinks[index];
        index++;
        log.debug('load drink id', drink.idDrink, `${index} of ${len}`, `${Math.round((index / len) * 100)}%`);
        const [error, drink_result] = await request(`${config_keys.root_url}/${api_key}/lookup.php?i=${drink.idDrink}`);
        if (error) {
            log.error('load drink id', drink.idDrink, error);
            continue;
        }
        if (!Array.isArray(drink_result.drinks)) {
            log.error('load drink id, wrong result', drink_result);
            continue;
        }
        result.push(drink_result.drinks);
    }

    const drinks_detail = result.reduce((acc, cur) => [].concat(acc, cur), []);

    // store in cache file
    write_cache(cache_file, drinks_detail);
    return drinks_detail;
};
