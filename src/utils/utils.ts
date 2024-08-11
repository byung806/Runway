import { Platform } from "react-native";
import checkVersion from "react-native-store-version";
import VersionNumber from 'react-native-version-number';


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

const init = async () => {
    try {
        const localVersion = VersionNumber.appVersion;
        const buildVersion = VersionNumber.buildVersion;
        const check = await checkVersion({
            version: localVersion, // app local version
            iosStoreURL: 'ios app store url',
            androidStoreURL: 'android app store url',
            country: 'us', // default value is 'jp'
        });

        if (check.result === 'new') {
            // if app store version is new
        }
    } catch (e) {
        console.log(e);
    }
};