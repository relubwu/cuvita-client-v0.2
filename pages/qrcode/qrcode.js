import * as LocalePackage from 'locale-package';
import QRDrawer from '../../lib/wx.base64.qrcode';

const { Store } = getApp();

/**
 * CUVita Client Side Implementations - index.js
 * @scope /pages/qrcode
 * @author relubwu
 * @version 0.1.7
 * @copyright  © CHINESE UNION 2019
 */

Page({
  data: {
    LocalePackage
  },
  onLoad(options) {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo,
      context: QRDrawer.createQrCodeImg(options.context || '')
    });
  },
  mapStateToPage: function () {

  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
});