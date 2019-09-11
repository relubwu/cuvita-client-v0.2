import * as localePackage from 'locale-package';
import QRDrawer from '../../lib/wx.base64.qrcode';

const { Store } = getApp();

/**
 * CUVita Client Side Implementations - index.js
 * @scope /pages/qrcode
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

Page({
  data: {
    localePackage
  },
  onLoad(options) {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo,
      context: QRDrawer.createQrCodeImg(options.context || '')
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    });
  }
});