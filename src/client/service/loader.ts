
let count = 0;
let inited = false;
let cb: Function | null = null;
export function ref() {
  inited = true;
  count++;
}

export function unref() {
  count--;
  if (cb) {
    cb();
  }
}

export function setCb(_cb: typeof cb) {
  cb = _cb;
  if (inited && count === 0 && cb) {
    cb();
  }
}
