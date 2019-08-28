import feedback from '../../../../utils/feedback';

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
      // Synchronous storage hook
      let { locale } = Store.getState().global;
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
    feedback
  }
})
