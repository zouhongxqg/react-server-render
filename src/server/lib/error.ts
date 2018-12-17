import {
  isBoolean,
  isNumber,
  isString,
} from './types';
import config = require('config');
const SERVER_HANDLE_SUCCESS_CODE = 2000;

type ErrorOptions = {
  /**
   * 是否忽略此错误
   */
  ignore?: boolean,
  /**
   * 是否展示给客户端
   */
  show?: boolean,
  /**
   * 后端返回的错误码
   */
  code?: number,
  /**
   * HTTP 状态码
   */
  status?: number,
  /**
   * 附加数据
   */
  // tslint:disable-next-line:no-any
  data?: any,
}

type ThriftStatus = {
  code: number;
  msg: string;
}


export default class ServerError extends Error {
  ignore: boolean;
  show: boolean;
  code: number;
  status: number;
  // tslint:disable-next-line:no-any
  data: any;

  constructor(options: ErrorOptions & { message: string });
  constructor(message: string);
  constructor(options: {
    message: string
  } & ErrorOptions | string) {
    isString(options) ? super(options) : super(options.message);

     this.ignore = false;
     this.show = true;
     this.code = 500;
     this.status = 500;
    if (!isString(options)) {
      this.setOptions(options);
    }
  }

  setOptions(options: ErrorOptions) {
    if (isBoolean(options.ignore)) {
      this.ignore = options.ignore;
    }

    if (isBoolean(options.show)) {
      this.show = options.show;
    }

    if (isNumber(options.code)) {
      this.code = options.code;
    }

    if (isNumber(options.status)) {
      this.status = options.status;
    }

    if (options.data) {
      this.data = options.data;
    }
  }
}

/**
 * 判断 thrift 返回结果是否正常
 */
export const assertThriftSuccess = (response: {
  status: ThriftStatus
 // tslint:disable-next-line:no-any
 }, method: string, args: any[]) => {
  const status = response.status;
  if (config.get('isMock')) return;
  if (!status || !status.code) return;
  if (status.code === SERVER_HANDLE_SUCCESS_CODE) {
    return;
  } else {
    throw new ServerError({
      message: status.msg,
      code: status.code,
      data: {
        method,
        args,
      },
    });
  }
}
