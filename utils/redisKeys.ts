export const getKeyName = (...args: string[]) => {
    return `redis:${args.join(':')}`;
};