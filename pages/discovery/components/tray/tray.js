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
      let { locale, user } = Store.getState().global;
      this.setData({
        locale,
        localePackage,
        user
      });
      this.unsubscribe = Store.subscribe(() => {
        mapStateToComponent(Store, this, { locale: 'global.locale', user: 'global.user' });
      });
    },
    detached: function () {
      this.unsubscribe();
    },
  },
  methods: {
    feedback,
    implementing: function () {
      feedback();
      wx.showToast({
        title: GlobalLocalePackage.sorry[this.data.locale],
        icon: 'none'
      });
    }
  }
})
