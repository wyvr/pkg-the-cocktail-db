const { to_slug } = require('@lib/helper/slug');

module.exports = (value) => {
    return encodeURIComponent(to_slug(value));
};
