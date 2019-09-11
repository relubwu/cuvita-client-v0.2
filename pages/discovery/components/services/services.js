import feedback from '../../../../utils/feedback';
import mapStateToComponent from '../../../../lib/wx.state.binder';

const { Store, GlobalActions } = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    services: {
      type: Array
    }
  },
  lifetimes: {
    attached: function () {
      let { locale } = Store.getState().global;
      this.setData({
        locale
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
