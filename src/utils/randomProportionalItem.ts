export function randomProportionalItem<T extends { count: number }>(...items: T[]): T {
    const totalCount: number = items.reduce((accumulator: number, item: T) => accumulator + item.count, 0);

    const randomNumber: number = Math.floor(Math.random() * totalCount);

    let currentCount: number = 0;

    for (const item of items) {
        currentCount += item.count;

        if (currentCount > randomNumber) {
            return item;
        }
    }

    throw new Error('This should never happen.');
}
