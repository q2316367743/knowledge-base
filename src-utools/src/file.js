const {readFile} = require('node:fs');
const {basename} = require('node:path');

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    })
  })
}

const showOpenDialog = (() => {
  if ('utools' in window) {
    return utools.showOpenDialog;
  } else if ('focusany' in window) {
    return focusany.showOpenDialog;
  } else {
    return () => []
  }
})();

/**
 * 获取一个文件
 * @param options {options: {
 *     title?: string,
 *     defaultPath?: string,
 *     buttonLabel?: string,
 *     filters?: { name: string, extensions: string[] }[],
 *     properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>,
 *     message?: string,
 *     securityScopedBookmarks?: boolean
 *   }} 参数
 * @return {Promise<Array<File>>} 返回文件对象
 */
async function openFile(options) {
  const paths = showOpenDialog(options);
  const files = [];
  for (const path of paths) {
    const data = await readFileAsync(path);
    const name = basename(path);
    const type = 'application/octet-stream';
    const blob = new Blob([data], {type: type});
    const file = new File([blob], name, {type: type});
    // 给文件对象添加path属性
    file.path = path;
    files.push(file);
  }
  return files;
}


module.exports = {
  openFile,
}
