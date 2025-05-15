const getPath = (() => {
  if ('utools' in window) {
    return utools.getPath;
  } else if ('focusany' in window) {
    return focusany.getPath;
  } else {
    return () => ''
  }
})();
const showSaveDialog = (() => {
  if ('utools' in window) {
    return utools.showSaveDialog;
  } else if ('focusany' in window) {
    return focusany.showSaveDialog;
  } else {
    return () => undefined;
  }
})();
const shellOpenPath = (() => {
  if ('utools' in window) {
    return utools.shellOpenPath;
  } else if ('focusany' in window) {
    return focusany.shellOpenPath;
  } else {
    return () => {
    };
  }
})();

/**
 * Blob转Buffer
 * @param blob {Blob} 内容
 * @return {Promise<Buffer>}
 */
const blobToBuffer = async (blob) => {
  return blob.arrayBuffer().then(buffer => Buffer.from(buffer));
};

module.exports = {
  getPath, showSaveDialog, shellOpenPath, blobToBuffer
}