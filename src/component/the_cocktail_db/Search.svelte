<script>
    wyvr: {
        render: 'hydrate';
        loading: 'none';
        trigger: 'load_the_cocktail_db_search';
    }
    import { _inject, isServer, onServer } from '@wyvr/generator';
    import { onMount } from 'svelte';
    import search_fn from '@src/component/the_cocktail_db/_search_fn';

    export let data;

    let search = (term, data) => {};
    let search_term;
    let search_result;
    let search_debouncer;
    let input;
    let state = 'waiting';

    onServer(() => {
        data = _inject('the_cocktail_db_drink', [], (result) => {
            return result.map((entry) => {
                const item = {
                    id: entry.key,
                    name: entry.value.strDrink,
                    url: entry.value.url,
                };
                if (entry.value.strGlass) {
                    item.glass = entry.value.strGlass;
                }
                if (entry.value.strTags) {
                    item.tags = entry.value.strTags;
                }
                return item;
            });
        });
    });
    onMount(() => {
        input.focus();
        if (!search_fn) {
            state = 'error';
            return;
        }
        search = search_fn;
    });

    function search_executor() {
        state = 'busy';
        if (search_debouncer) {
            clearTimeout(search_debouncer);
        }
        search_debouncer = setTimeout(async () => {
            search_result = await search(search_term, data);
            state = 'idle';
        }, 200);
    }
    function search_submit(e) {
        e.preventDefault();
        if (Array.isArray(search_result) && search_result.length > 0) {
            const href = search_result[0].url;
            if (href) {
                window.location = href;
            }
        }
    }
    function highlight(value, highlight) {
        if (typeof value != 'string') {
            return '';
        }
        return value
            .replace(/(<(\/?[^>]+)>)/g, '')
            .replace(
                new RegExp(
                    `(${highlight.replace(/([^a-z0-9 ,])/gi, '\\$1')})`,
                    'i'
                ),
                '<span class="highlight">$1</span>'
            );
    }
</script>

<div class="search">
    <form on:submit={search_submit}>
        {#if isServer}
            <input
                id="the_cocktail_db_search"
                onfocus="wyvr.load_the_cocktail_db_search()"
                placeholder=" "
            />
        {:else}
            <input
                id="the_cocktail_db_search"
                placeholder=" "
                bind:this={input}
                bind:value={search_term}
                on:keyup={search_executor}
            />
        {/if}
        <label for="the_cocktail_db_search"
            ><i class="ri-search-line" /> <span>Search drink</span></label
        >
    </form>
    {#if search_result}
        <div class="result">
            {#if search_result.length > 0}
                <ul>
                    {#each search_result as entry}
                        <li>
                            <a href={entry.url}
                                >{@html highlight(entry.name, search_term)}</a
                            >
                        </li>
                    {/each}
                </ul>
            {:else}
                Nothing found with "{search_term}"
            {/if}
        </div>
    {/if}
</div>

<style>
    .search {
        position: relative;
    }
    form {
        display: block;
        position: relative;
    }
    input {
        border-radius: calc(var(--size) * 0.25);
        background-color: var(--color-background);
        color: var(--color-text);
        height: calc(var(--size) * 2);
        width: 100%;
        border: 2px solid var(--color-text);
        outline: none;
        font-size: var(--size);
    }
    @media (min-width: 768px) {
        input {
            width: calc(var(--size) * 10);
        }
    }
    label {
        pointer-events: none;
        position: absolute;
        height: calc(var(--size) * 2);
        line-height: calc(var(--size) * 2);
        top: 0;
        left: var(--size);
        color: var(--color-text);
        opacity: 0.5;
        white-space: nowrap;
        right: var(--size);
        text-overflow: ellipsis;
        overflow: hidden;
        transition: opacity 0.1s linear;
        text-align: left;
    }
    label * {
        vertical-align: bottom;
    }
    input:focus {
        border-color: var(--color-primary);
    }
    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
        opacity: 0;
    }
    .result {
        position: absolute;
        padding: var(--size);
        color: var(--color-text);
        background-color: var(--color-primary);
        right: 0;
        top: 100%;
        border-radius: calc(var(--size) * 0.25);
        box-shadow: 0 calc(var(--size) * 0.25) var(--size) rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }
    .result a {
        color: var(--color-text);
    }
    .result ul,
    .result li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .result li {
        padding-bottom: calc(var(--size) * 0.25);
        white-space: nowrap;
    }
    .result li:before {
        content: '🍹';
        margin-right: calc(var(--size) * 0.25);
    }
    .result :global(.highlight) {
        background-color: var(--color-text);
        color: var(--color-primary);
        display: inline-block;
        padding: calc(var(--size) * 0.125);
        border-radius: calc(var(--size) * 0.125);
    }
</style>
