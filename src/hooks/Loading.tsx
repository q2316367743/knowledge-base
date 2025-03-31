import {LoadingPlugin} from "tdesign-vue-next";

type UseLoadingResult = () => void;

export function useLoading(text?: string): UseLoadingResult {

  const loadingInstance = LoadingPlugin({
    text,
    fullscreen: true
  });

  // TODO: 此处需要一个超时检测

  return () => {
    loadingInstance.hide();
  }

}