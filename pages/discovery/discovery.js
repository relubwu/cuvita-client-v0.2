import * as Actions from 'actions';
import * as LocalePackage from 'locale-package';
import services from '../../config/services.config';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    scrollTop: 0,
    tray: services.slice(0, 4),
    services: services.slice(4),
    recommendation: {
      title: ['为你推荐'],
      description: ['查看更多'],
      items: [{ title: "Test", description: { 0: "a very long description" } }, { title: "Test", description: { 0: "a very long description" } }, { title: "Test", description: { 0: "a very long description" } }],
      target: ''
    }
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onLoad: function (options) {
    // Synchronous storage hook
    this.setData({
      ...Store.getState().global
    });
  },
  onScroll: function ({ detail: { scrollTop } }) {
    if (this.data.scrollTop > -this.data.systemInfo.screenWidth * 1.2 && scrollTop <= -this.data.systemInfo.screenWidth * 1.2)
      this.feedback();
    this.setData({
      scrollTop
    });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onHide: function () {
    this.unsubscribe();
  },
  onUnLoad: function () {

  },
  feedback
})