import root from '../config/api.config';

export function fetch(directory, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      url: root.concat(directory),
      method: 'get',
      success: function ({ statusCode, data }) {
        statusCode === 500 ? (() => { wx.showToast({ image: '/assets/icons/request-fail.png' }) })() : resolve(data);
      },
      fail: function (e) {
        reject(e)
      }
    })
  });
}

export function post(directory, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      url: root.concat(directory),
      method: 'post',
      success: function ({ statusCode, data }) {
        statusCode === 500 ? (() => { wx.showToast({ image: '/assets/icons/request-fail.png' }) })() : resolve(data);
      },
      fail: function (e) {
        reject(e)
      }
    })
  });
}

export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success({ code }) {
        resolve(code);
      }
    });
  });
}

export function requestPayment(bundle) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...bundle,
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      success(res) {
        resolve(res);
      },
      fail(e) {
        reject(e);
      }
    });
  });
}