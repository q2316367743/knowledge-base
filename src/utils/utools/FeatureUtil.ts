import Constant from "@/global/Constant";

/**
 * 关键字
 */
export interface Feature {
    code: string,
    explain: string,
    platform: FeaturePlatform | Array<FeaturePlatform>,
    icon?: string,
    cmds: Array<string | FeatureCmd>
}

/**
 * 可用平台
 */
export type FeaturePlatform = 'darwin' | 'win32' | 'linux';

/**
 * 关键字设置
 */
export interface FeatureCmd {
    type: FeatureCmdType,
    label: string,
    fileType?: FeatureCmdFileType,
    match?: string,
    minLength?: number
    maxLength?: number
}

export type FeatureCmdType = 'img' | 'files' | 'regex' | 'over' | 'window';

export type FeatureCmdFileType = 'file' | 'directory';

/**
 * 设置一个关键字
 * @param code code
 * @param cmd 关键字
 */
export function setFeatureOneSimple(code: string, cmd: FeatureCmd | string): boolean {
    return utools.setFeature({
        code: code,
        explain: Constant.name,
        icon: "public/logo.png",
        platform: [
            "win32",
            "darwin",
            "linux"
        ],
        cmds: [cmd]
    });
}

/**
 * 设置一个关键字
 * @param feature 关键字
 */
export function setFeatureOne(feature: Feature) {
    return utools.setFeature(feature);
}

/**
 * 根据Code获取唯一的feature
 * @param code feature的code
 */
export function getFeatureOne(code: string): Feature | null {
    const features = utools.getFeatures([code]);
    if (features.length === 0) {
        return null;
    }
    for (let feature of features) {
        if (feature.code === code) {
            // @ts-ignore
            return feature;
        }
    }
    return null;
}

/**
 * 移出一个关键字
 * @param code code
 */
export function removeFeatureOne(code: string): boolean {
    return utools.removeFeature(code);
}

/**
 * 列出多个
 * @param prefix 前缀/数组
 * @param keys 如果prefix是数组，则此参数无效
 */
export function listFeature(prefix: string | string[], keys?: Array<any>): Array<string> {
    let features;
    if (typeof prefix === 'string') {
        if (keys) {
            features = utools.getFeatures(keys.map(key => prefix + key));
        } else {
            features = utools.getFeatures([prefix]);
        }
    } else {
        features = utools.getFeatures(prefix);
    }
    return features.map(feature => feature.code);
}
