const isClient = typeof window !== "undefined";

export const getContentSession = (key, initialValue) => {
    if (!isClient) return initialValue;

    const stored = contentSession.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
};

export const setContentSession = (key, value) => {
    if (!isClient) {
        contentSession.setItem(key, JSON.stringify(value))
    }
};