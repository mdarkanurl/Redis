export const getKeyName = (...args: string[]) => {
    return `redis:${args.join(':')}`;
};

export const restaurantKeyById = (id: string) => {
    return getKeyName('restaurants', id);
};

export const reviewKeyById = (id: string) => {
    return getKeyName('reviews', id);
};

export const reviewDetailsKeyById = (id: string) => {
    return getKeyName('review-details', id);
};

export const cuisinesKey = getKeyName('cuisines');
export const cuisineKey= (name: string) => {
    return getKeyName('cuisine', name);
}

export const restaurantCuisinesKeyById = (id: string) => 
        getKeyName('restaurant_cuisines', id);