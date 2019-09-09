import feedback from '../../../../utils/feedback';
import mapStateToComponent from '../../../../lib/wx.state.binder';
import * as localePackage from './locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  lifetimes: {
    attached: function () {
      // Synchronous storage hook
      let { locale } = Store.getState().global;
      this.setData({
        locale,
        localePackage
      });
      this.unsubscribe = Store.subscribe(() => {
        mapStateToComponent(Store, this, { locale: 'global.locale' });
      });
    },
    detached: function () {
      this.unsubscribe();
    },
  },
  /**
   * Component methods
   */
  methods: {
    feedback: function () {
      feedback();
      wx.showToast({
        title: GlobalLocalePackage.sorry[this.data.locale],
        icon: 'none'
      });
    }
  }
})
