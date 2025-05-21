const getPath = utools.getPath;
const showSaveDialog = utools.showSaveDialog;
const shellOpenPath = utools.shellOpenPath;

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