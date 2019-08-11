import { request, METHOD } from '../../utils/promisfy';
import { ARTICLE } from '../../config/api.config';
import * as Toasts from '../../utils/toasts';

const { Store, GlobalLocalePackages } = getApp();

/**
 * CUVita Client Side Implementations - index.js
 * @scope /pages/article/detail
 * @author relubwu
 * @version 0.1.6
 * @copyright  © CHINESE UNION 2019
 */

Page({
  onLoad: function ({ reference }) {
    // Synchronous storage hook
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo
    });
    wx.showLoading({
      title: GlobalLocalePackages.loading[Store.getState().global.locale]
    });
    request(ARTICLE.DETAIL, METHOD.GET, { reference })
      .then(detail => {
        detail.nodes = JSON.parse(detail.nodes); 
        this.setData({ ...detail });
        wx.hideLoading();
      })
      .catch(e => Toasts.requestFailed(Store.getState().global.locale));
    // let that = this;
    // wx.showNavigationBarLoading();
    // request(API.URL_ARTICLE_DETAIL, 'GET', { id: options.id }).then(res => {
    //   this.setData(res);
    //   wx.hideNavigationBarLoading();
    // }).catch(e => console.error(e));
  }
})