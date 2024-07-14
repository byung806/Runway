export const delay = async (ms: any) => {
    return new Promise((resolve) =>
        setTimeout(resolve, ms));
};