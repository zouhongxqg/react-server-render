const path = require('path');
const fs = require('mz/fs');

async function rmrf(filepath, valid) {
  if (!await fs.exists(filepath)) return;
  const state = await fs.stat(filepath);
  if (state.isFile()) {
    if (valid && !valid(filepath)) {
      return;
    }
    return await fs.unlink(filepath);
  } else if (state.isDirectory()) {
    const files = await fs.readdir(filepath);
    await Promise.all(files.map(file => {
      return rmrf(path.join(filepath, file), valid);
    }));
    return;
  }
  throw new Error('unknow file type:', filepath);
}

module.exports = rmrf;
