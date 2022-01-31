const { request } = require('@lib/helper/request');
const { read_cache, write_cache } = require('@lib/helper/cache');
const log = require('./_log');
const { join } = require('path');

const config_keys = require('../resources/_config_keys');

module.exports = async (api_key) => {
    if (!api_key) {
        return [];
    }
    const cache_file = join(config_keys.name, 'categories.json');
    // read from cache
    const from_cache = read_cache(cache_file);
    if(from_cache) {
        log.improve('load categories from cache', cache_file);
        return from_cache;
    }
    // load from external
    const [error, result] = await request(`${config_keys.root_url}/${api_key}/list.php?c=list`);
    if (error) {
        log.error('load categories', error);
        return [];
    }
    if (!Array.isArray(result.drinks)) {
        log.error('load categories, wrong result', result);
        return [];
    }
    
    const categories = result.drinks.map((cat) => cat.strCategory).filter((x) => x);
    // store in cache file
    write_cache(cache_file, categories);

    return categories;
};
