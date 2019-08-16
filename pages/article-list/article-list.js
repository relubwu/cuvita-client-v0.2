import { request, METHOD } from '../../utils/promisfy';
import { ARTICLE } from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as Toasts from '../../utils/toasts';

const { Store, GlobalLocalePackages } = getApp();

/**
 * CUVita Client Side Implementations - index.js
 * @scope /pages/article/list
 * @author relubwu
 * @version 0.1.6
 * @copyright  © CHINESE UNION 2019
 */

Page({
  data: {
    articles: [{}, {}, {}]
  },
  onLoad() {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo
    });
    wx.setNavigationBarTitle({
      title: LocalePackage.title[this.data.locale]
    });
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    request(ARTICLE.LIST, METHOD.GET)
      .then(articles => {
        this.setData({ articles });
        wx.hideLoading();
      })
      .catch(e => {
        Toasts.requestFailed(this.data.locale);
        wx.hideLoading();
      });
  }
})