module.exports = async (term, data) => {
    if (!Array.isArray(data) || !term) {
        return undefined;
    }
    const search_term = term.trim().toLowerCase();
    return data.filter((entry) => {
        return Object.values(entry)
            .join('|')
            .toLowerCase()
            .indexOf(search_term) > -1;
    }).slice(0, 5);
};
