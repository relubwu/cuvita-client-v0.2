import { API_URL } from '../config/api.config';
/**
 * 请求参数常量
 */
export const METHOD = {
  GET: 'GET',
  POST: 'POST'
}
/**
 * 封装wx.request()
 * @param directory, Object data, String method
 * @return Promise ? resolve() : reject()
 */
export function request(directory, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_URL.concat(directory),
      method,
      data,
      success({ data, statusCode }) {
        if (statusCode === 400 || statusCode === 404 || statusCode === 500)
          reject(statusCode);
        resolve(data);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
/**
 * 封装wx.getSystemInfo()
 */
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
/**
 * 封装wx.login()
 */
export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success({ code }) {
        resolve(code);
      }
    });
  });
}
/**
   * 封装wx.requestPayment()
   * @param prepayId, paySign
   */
export function requestPayment(prepayId, paySign) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: Date.now().toString(),
      nonceStr: Math.random().toString(32).substring(2, 15) + Math.random().toString(32).substring(2, 15),
      "package": prepayId,
      signType: 'MD5',
      paySign,
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
/**
 * 封装wx.getNetworkType()
 */
export function getNetworkType() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success({ networkType }) {
        resolve(networkType);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}
