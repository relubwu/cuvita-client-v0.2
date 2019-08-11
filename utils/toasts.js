import * as GlobalLocalePackages from '../locale-package';

export const requestFailed = locale => {
  wx.showToast({
    title: GlobalLocalePackages.requestFailed[locale],
    image: '/assets/icons/request-fail.png'
  });
}