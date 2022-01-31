<script>
    import Header from '@src/component/the_cocktail_db/Header.svelte';
    import Image from '@src/component/Image.svelte';
    import { onServer } from '@wyvr/generator';

    export let data = null;

    let path = [];
    let headline = 'TheCocktailDB';
    onServer(() => {
        if (data?.category) {
            path = [data.category];
            headline = data.category.name;
        }
    });
</script>

<Header {path} {headline}>
    <slot />
</Header>

{#if data?.category}
    {#if data.category.drinks}
        <div>
            <ul>
                {#each data.category.drinks as drink}
                    <li>
                        <a href={drink.url} class="text-over-image round">
                            <Image
                                src={drink.strDrinkThumb}
                                width="400"
                                height="400"
                                alt={drink.strDrink}
                                lazy={true}
                            />
                            <span>{drink.strDrink}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
{:else}
    <div class="error">category is missing</div>
{/if}

<style>
    @import '@src/page/the_cocktail_db/_list.css';
</style>
