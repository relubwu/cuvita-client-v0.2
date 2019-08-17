/**
 * CUVita Client Side Implementations - index.js
 * @scope /pages/article/detail
 * @author relubwu
 * @version 0.1.6
 * @copyright  © CHINESE UNION 2019
 */

Page({
  onLoad: function ({ reference }) {
    this.setData({
      src: `https://mp.weixin.qq.com/s/${ reference }`
    });
  }
})