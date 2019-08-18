import feedback from '../../../../utils/feedback';

const { Store, GlobalActions } = getApp();

Component({
  options: {
    addGlobalClass: true
  }, 

  lifetimes: {
    attached: function () {
      // Synchronous storage hook
      let { global: { locale }, page: { discovery: { services } } } = Store.getState();
      this.setData({
        locale,
        tray: services.slice(0, 4)
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
      if (JSON.stringify(this.data.services) !== JSON.stringify(newState.page.discovery.services.slice(0, 4)))
        this.setData({
          tray: newState.page.discovery.services.slice(0, 4)
        });
    },
    feedback
  }
})
