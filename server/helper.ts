import { MosaicInfo, MosaicNames } from 'symbol-sdk';

export default class Helper {
    static stringToArray(str: string | undefined): string[] {
        let result = null;

        try {
            if (typeof str === 'string') result = JSON.parse(str);
        } catch (e) {}
        return result;
    }

    static toRelativeAmount(amount: number, divisibility: number): number {
        return amount / Math.pow(10, divisibility);
    }

    static toAbsoluteAmount(amount: number, divisibility: number): number {
        return amount * Math.pow(10, divisibility);
    }

    static getMosaicsRandomAmount(faucetBalance: number): number {
        const max = faucetBalance * 0.15;
        const min = faucetBalance * 0.1;
        const absoluteAmount = Math.random() * (max - min) + min;
        return Math.round(absoluteAmount);
    }

    static getNativeCurrencyRandomAmount(faucetBalance: number, minOut: number, maxOut: number): number {
        const absoluteAmount = Math.min(Math.min(faucetBalance, maxOut), Math.random() * (minOut - maxOut + 1) + maxOut);
        return Math.round(absoluteAmount);
    }

    static extractMosaicNamespace(mosaicInfo: MosaicInfo, mosaicNames: MosaicNames[]): string {
        const mosaicName = mosaicNames.find((name) => name.mosaicId.equals(mosaicInfo.id));

        if (mosaicName instanceof MosaicNames) {
            return mosaicName.names.length > 0 ? mosaicName.names[0].name : mosaicInfo.id.toHex();
        }

        return mosaicInfo.id.toHex();
    }
}
