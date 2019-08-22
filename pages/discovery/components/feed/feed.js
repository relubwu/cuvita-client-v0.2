import services from '../../../../config/services.config';
import feedback from '../../../../utils/feedback';
import { request, METHOD } from '../../../../utils/promisfy';
import { FIELD } from '../../../../config/api.config';

const { Store, GlobalActions } = getApp();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    title: {
      type: Array,
      value: []
    },
    action: {
      type: Array,
      value: []
    },
    articles: {
      type: Array,
      value: []
    }
  },

  lifetimes: {
    attached: function () {
      // Synchronous storage hook
      let { locale, region } = Store.getState().global
      this.setData({
        locale, region
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
