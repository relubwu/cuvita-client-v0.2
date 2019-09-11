import feedback from '../../../../utils/feedback';
import mapStateToComponent from '../../../../lib/wx.state.binder';
import * as localePackage from 'locale-package';

const { Store, GlobalActions } = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    localePackage
  },
  properties: {
    articles: {
      type: Array,
      value: []
    }
  },
  lifetimes: {
    attached: function () {
      let { locale, region } = Store.getState().global
      this.setData({
        locale, region
      });
      this.unsubscribe = Store.subscribe(() => {
        mapStateToComponent(Store, this, { locale: 'global.locale' });
      });
    },
    detached: function () {
      this.unsubscribe();
    },
  },
  methods: {
    feedback
  }
})
