import * as LocalePackage from 'locale-package';
import QRDrawer from '../../lib/wx.base64.qrcode';
// import * as actions from 'actions';
// const app = getApp();
// const Store = app.store;
// const localepkg = require('localepkg');

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
    // let that = this;
    // this.unsubscribe = Store.subscribe(() => {
    //   this.relaySubscription();
    // });
    // let context = decodeURIComponent(
    //   options.context
    // )
    // this.worker = wx.createWorker('/async/drawqr/index.js');
    // this.worker.postMessage({
    //   context,
    //   screenWidth: Store.getState().global.systemInfo.screenWidth
    // });
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo,
      context: QRDrawer.createQrCodeImg(options.context || '')
    });
    // this.worker.onMessage(context => {
    //   // 单次渲染完成后直接detach
    //   that.worker.terminate();
    //   that.setData({
    //     ...context
    //   });
    // })
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    // this.fetchData();
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
});