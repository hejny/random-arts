export function randomItem<T>(...items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * Note: This function is also in Collboard core but it is more beneficial for us to have it here indipendently than keep DRY across separate repositories.
 */
