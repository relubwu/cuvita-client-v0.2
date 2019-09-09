import root from '../config/api.config copy';

export function fetch(directory, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      url: root.concat(directory),
      method: 'get',
      success: function (res) {
        res.statusCode === 500 ? (() => { wx.showToast({ image: '/assets/icons/request-fail.png' }) })() : resolve(res);
      },
      fail: function (e) {
        reject(e)
      }
    })
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url, data,
      method: 'post',
      success: function (res) {
        resolve(res);
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
    })
  })
}