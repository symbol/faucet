export const stringToArray = (str: string | undefined): string[] => {
    let result = null;

    try {
        if (typeof str === 'string') result = JSON.parse(str);
    } catch (e) {
        return [''];
    }
    return result;
};

export const toRelativeAmount = (amount: number, divisibility: number) => amount / Math.pow(10, divisibility);

export const toAbsoluteAmount = (amount: number, divisibility: number) => amount * Math.pow(10, divisibility);

export const getMosaicsRandomAmount = (faucetBalance: number): number => {
    const max = faucetBalance * 0.15;
    const min = faucetBalance * 0.1;
    const absoluteAmount = Math.random() * (max - min) + min;
    return Math.round(absoluteAmount);
};

export const getNativeCurrencyRandomAmount = (faucetBalance: number, minOut: number, maxOut: number): number => {
    const absoluteAmount = Math.min(Math.min(faucetBalance, maxOut), Math.random() * (minOut - maxOut + 1) + maxOut);
    return Math.round(absoluteAmount);
};
