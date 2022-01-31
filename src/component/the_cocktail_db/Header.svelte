<script>
    import Breadcrumbs from '@src/component/the_cocktail_db/Breadcrumbs.svelte';
    import Search from '@src/component/the_cocktail_db/Search.svelte';

    export let path = [];
    export let headline = 'TheCocktailDB';
</script>

<Breadcrumbs {path} />
<div class="headline">
    <h1>{headline}</h1>
    <Search />
</div>
<slot />

<style>
    .headline {
        text-align: right;
        margin-bottom: var(--size);
    }
    .headline :global(*) {
        text-align: left;
    }
    @media (min-width: 768px) {
        .headline {
            display: flex;
            justify-content: space-between;
        }
    }
</style>
