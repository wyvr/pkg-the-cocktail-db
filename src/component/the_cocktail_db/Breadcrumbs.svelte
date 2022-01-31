<script>
    export let path = [];
</script>

<nav class="breadcrumbs">
    <a href="/drinks">TheCocktailDB</a>
    {#each path as entry}
        <a href={entry.url}>{entry.name}</a>
    {/each}
</nav>

<style>
    .breadcrumbs {
        display: flex;
        align-items: center;
        margin-bottom: calc(var(--size) * 1);
        height: calc(var(--size) * 2);
        overflow: hidden;
        border-top-left-radius: calc(var(--size) * 0.25);
        border-bottom-left-radius: calc(var(--size) * 0.25);
    }
    .breadcrumbs a {
        --breadcrumb-color: var(--color-primary);
        display: flex;
        align-items: center;
        position: relative;
        color: var(--color-text);
        line-height: calc(var(--size) * 2);
        height: calc(var(--size) * 2);
        padding-right: calc(var(--size) * 0.5);
        padding-left: calc(var(--size) * 1.5);
        color: var(--color-background);
        background-color: var(--breadcrumb-color);
        transition: color 0.2s ease-out;
        white-space: nowrap;
    }
    .breadcrumbs a:first-child {
        padding-left: calc(var(--size) * 0.75);
    }
    .breadcrumbs a:hover,
    .breadcrumbs a:active {
        color: var(--color-text);
    }
    .breadcrumbs a::after {
        content: '';
        position: absolute;
        width: calc(var(--size) * 1.6);
        height: calc(var(--size) * 1.6);
        transform: rotate(45deg);
        border-top-right-radius: calc(var(--size) * 0.25);
        right: calc(var(--size) * -0.75);
        z-index: 2;
        border-top: 2px solid var(--color-background);
        border-right: 2px solid var(--color-background);
        background-image: linear-gradient(45deg, transparent 50%, var(--breadcrumb-color) 50%);
    }
</style>
