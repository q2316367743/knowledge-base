import Constant from "@/global/Constant";

interface Feature {
  code: string,
  explain: string,
  platform: FeaturePlatform | Array<FeaturePlatform>,
  icon?: string,
  cmds: Array<string | FeatureCmd>
}

type FeaturePlatform = 'darwin' | 'win32' | 'linux';

interface FeatureCmd {
  type: FeatureCmdType,
  label: string,
  fileType?: FeatureCmdFileType,
  match?: string,
  minLength?: number
  maxLength?: number
}

type FeatureCmdType = 'files' | 'regex' | 'over';

type FeatureCmdFileType = 'file' | 'directory';

// uTools都有的工具
export const UToolsUtil = {
  feature: {
    listFeature(prefix: string | string[], keys?: Array<any>): Array<string> {
      if (window['utools']) {
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
      } else {
        return [];
      }
    },
    setFeatureOneSimple(code: string, cmd: FeatureCmd | string): boolean {
      if (window['utools']) {
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
      } else {
        return false
      }
    },
    getFeatureOne(code: string): Feature | null {
      if (window['utools']) {
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
      } else {
        return null
      }
    },
    removeFeatureOne(code: string): boolean {
      if (window['utools']) {
        return utools.removeFeature(code)
      } else {
        return false;
      }
    },
  },
}