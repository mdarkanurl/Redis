export const getKeyName = (...args: string[]) => {
    return `redis:${args.join(':')}`;
};

export const restaurantKeyById = (id: string) => {
    return getKeyName('restaurants', id)
};