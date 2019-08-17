import { request, METHOD } from '../../utils/promisfy';
import { ARTICLE } from '../../config/api.config';
import feedback from '../../utils/feedback';

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
    let { systemInfo, locale } = Store.getState().global;
    this.setData({
      systemInfo, locale
    });
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    request(ARTICLE.DETAIL, METHOD.GET, { reference })
      .then(detail => {
        detail.nodes = JSON.parse(detail.nodes).map(item => {
          return this.replace(item).node;
        });
        if (detail.action.target.length == 0)
          delete detail.action;
        this.setData({ ...detail });
        wx.hideLoading();
      })
      .catch(e => {
        wx.showToast({
          title: GlobalLocalePackages.requestFailed[this.data.locale],
          image: '/assets/icons/request-fail.png'
        });
      });
  },
  replace: function (node) {
    let childContainsImage = false;
    if (!!node.children)
      node.children = node.children.map(item => {
        let { node, containsImage } = this.replace(item);
        if (!!containsImage) childContainsImage = true;
        return node;
      })
    let containsImage = false;
    if (node.name === "img") {
      containsImage = true;
      node.attrs = this.addClass(node.attrs, 'ql-image');
    }
    if (childContainsImage)
      node.attrs = this.addClass(node.attrs, 'ql-image-container');
    return { node, containsImage };
  },
  addClass: function (attrs, classToAppend) {
    if (!attrs)
      return { ['class']: classToAppend };
    else
      if (!attrs['class'])
        return {
          ...attrs,
          ['class']: classToAppend
        }
      else
        return attrs['class'].append(` ${ classToAppend }`);
  },
  feedback
})