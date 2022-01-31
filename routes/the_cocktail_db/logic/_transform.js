const log = require('./_log');
const store = require('./_store');
const get_slug = require('./_get_slug');
const config_keys = require('../resources/_config_keys');

module.exports = async (categories, drinks) => {
    // build raw data
    const title = config_keys.title;

    // categories
    const categories_list = categories.map((name) => {
        const slug = get_slug(name);
        const url = `/drinks/category/${slug}/`;
        const image = drinks.find((drink) => drink.strCategory == name)?.strDrinkThumb;
        return {
            title,
            name,
            slug,
            url,
            image
        };
    });
    
    // pages
    const drinks_list = drinks.map((drink) => {
        drink.title = title;
        drink.slug = get_slug(drink.strDrink);
        drink.url = `/drinks/${drink.slug}/`;
        return drink;
    });

    await store(
        `${config_keys.name}_drink`,
        drinks_list,
        (drink) => drink.idDrink
    );

    // build category pages
    const category_pages = categories_list.map((entry) => {
        const category = Object.assign({}, entry);
        category.drinks = drinks_list.filter(
            (drink) => drink.strCategory == category.name
        );

        return {
            url: category.url,
            _wyvr: {
                template: ['the_cocktail_db/Category'],
                nav: [
                    {
                        name: category.name,
                        scope: 'drinks',
                    },
                ],
            },
            category,
        };
    });

    const drink_pages = drinks_list.map((drink) => {
        return {
            url: drink.url,
            _wyvr: {
                template: ['the_cocktail_db/Drink'],
            },
            drink,
        };
    });

    await store(
        `${config_keys.name}_category`,
        categories_list,
        (category) => category.slug
    );

    return [
        {
            url: '/drinks/',
            _wyvr: {
                template: ['the_cocktail_db/Overview'],
                nav: [
                    {
                        name: 'Drinks',
                        scope: 'header',
                    },
                ],
            },
            title,
            list: categories_list,
        },
    ].concat(category_pages, drink_pages);
};
