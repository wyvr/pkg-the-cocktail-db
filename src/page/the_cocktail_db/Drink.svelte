<script>
    import { onServer } from '@wyvr/generator';
    import Image from '@src/component/Image.svelte';
    import Header from '@src/component/the_cocktail_db/Header.svelte';

    export let data = null;

    let path = [];
    let headline = 'TheCocktailDB';

    let ingredients = [];
    onServer(() => {
        if (data?.drink) {
            ingredients = new Array(15)
                .fill(true)
                .map((x, i) => {
                    if (!data.drink['strIngredient' + (i + 1)]) {
                        return null;
                    }
                    return {
                        name: data.drink['strIngredient' + (i + 1)],
                        measure: data.drink['strMeasure' + (i + 1)],
                    };
                })
                .filter((x) => x);
            headline = data.drink.strDrink;
            path = [
                {
                    name: data.drink.strCategory,
                    url: `/drinks/category/${encodeURIComponent(
                        data.drink.strCategory
                            .replace(/\s+/g, '-')
                            .toLowerCase()
                    )}`,
                },
                {
                    name: data.drink.strDrink,
                    url: `/drinks/${data.drink.slug}`,
                },
            ];
        }
    });
</script>

<Header {path} {headline}>
    <slot />
</Header>

{#if data?.drink}
    <div class="main">
        <div class="image">
            <Image
                src={data.drink.strDrinkThumb}
                width="300"
                height="300"
                alt={data.drink.strDrink}
                css="round"
                lazy={false}
            />
        </div>

        <div class="content">
            {#if data.drink.strTags}
                <p><b>{data.drink.strTags}</b></p>
            {/if}

            <p>This drink is&nbsp;<b>{data.drink.strAlcoholic}</b></p>

            <p>Best served in&nbsp;<b>{data.drink.strGlass}</b></p>
            <br />
            <p>Ingredients:</p>
            <ul>
                {#each ingredients as ing}
                    <li>
                        <b
                            >{#if ing.measure}{ing.measure} {/if}{ing.name}</b
                        >
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <div class="detail">
        <p><i>How to make this drink:</i><br />{data.drink.strInstructions}</p>
    </div>
{:else}
    <div class="error">drink is missing</div>
{/if}

<style>
    .main {
        margin-top: var(--size);
    }
    .detail {
        margin-top: var(--size);
    }
    .image {
        margin-bottom: var(--size);
    }
    .image :global(picture) {
        box-shadow: 0 calc(var(--size) * 0.5) var(--size) rgba(0, 0, 0, 0.3);
    }
    @media (min-width: 768px) {
        .main {
            display: flex;
        }
        .image {
            margin-right: var(--size);
        }
    }
</style>
