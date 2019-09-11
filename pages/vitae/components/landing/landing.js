import * as localePackage from '../../locale-package';
import layout from '../../../../config/landing.config';

const { Store } = getApp();

Component({
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached: function () {
      // Synchronous storage hook
      let { locale } = Store.getState().global
      this.setData({
        locale
      });
      this.unsubscribe = Store.subscribe(() => {
        this.mapStateToComponent();
      });
    },
    detached: function () {
      this.unsubscribe();
    },
  },

  data: {
    layout, 
    localePackage
  },

  /**
   * Component methods
   */
  methods: {
    mapStateToComponent: function () {
      let newState = Store.getState();
      if (this.data.locale !== newState.global.locale)
        this.setData({
          locale: newState.global.locale
        });
    },
    register: function () {
      wx.navigateTo({
        url: '/pages/register/register'
      })
    },
    link: function () {
      wx.navigateTo({
        url: '/pages/link/link'
      })
    }
  }
})
