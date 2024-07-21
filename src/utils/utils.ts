export const delay = async (ms: any, message?: string) => {
    return new Promise((resolve) =>
        setTimeout(resolve, ms, message));
};

export async function callWithTimeout(timeout: any, fn: Function, ...args: any) {
    return Promise.race([
        fn(...args),
        delay(timeout, 'timeout')
    ])
}