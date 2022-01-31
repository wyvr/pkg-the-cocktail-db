<script>
    import Header from '@src/component/the_cocktail_db/Header.svelte';
    import Image from '@src/component/Image.svelte';

    export let data = null;
</script>

<Header>
    <slot />
</Header>
<p>
    An open, crowd-sourced database of drinks and cocktails from around the
    world.
</p>

{#if data?.list}
    <div>
        <ul>
            {#each data.list as category}
                <li>
                    <a href={category.url} class="text-over-image round">
                        <Image
                            src={category.image}
                            width="400"
                            height="400"
                            alt={category.name}
                            lazy={true}
                        />
                        <span>{category.name}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    @import '@src/page/the_cocktail_db/_list.css';
</style>
