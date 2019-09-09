import * as localePackage from '../../locale-package';
import * as creditPolicy from '../../../../config/credit.config';

const { Store } = getApp();

Component({
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached: function () {
      // Synchronous storage hook
      let { locale, member } = Store.getState().global
      this.setData({
        locale, member
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
    localePackage,
    ...creditPolicy
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
      if (this.data.member !== newState.global.member)
        this.setData({
          member: newState.global.member
        });
    }
  }
})
