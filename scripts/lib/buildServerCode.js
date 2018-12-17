const child_process = require('child_process');
const os = require('os');
const path = require('path');
const config = require('config');
const root = config.get('root');

/**
 * 构建服务端代码
 */
async function buildServerCode(onCompiled, watch = false) {
  await new Promise((resolve, reject) => {
    // 执行 tsc 命令编译服务端代码
    let bin = 'tsc';
    if (os.platform() === 'win32') {
      bin = 'tsc.cmd';
    }

    const args = ['-p', 'src']

    if (watch) {
      args.unshift('-w');
    }

    const child = child_process.spawn(
      path.join(root, `/node_modules/.bin/${bin}`),
      args
    );

    child.stderr.on('data', chunk => {
      process.stderr.write(chunk);
    });

    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      if (chunk.toString().includes('Compilation complete.')) {
        onCompiled && onCompiled();
      }
    })

    child.on('close', code => {
      if (code !== 0) {
        return reject(new Error('compile faild'));
      }
      resolve();
    })
  })
}

module.exports = buildServerCode;