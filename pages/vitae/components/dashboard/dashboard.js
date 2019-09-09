import * as localePackage from '../../locale-package';

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
    activeNames: ['history']
  },
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
    },
    onChange: function ({ detail }) {
      this.setData({
        activeNames: detail
      });
    },
  }
})
