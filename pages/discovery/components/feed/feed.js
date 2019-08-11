import services from '../../../../config/services.config';
import feedback from '../../../../utils/feedback';
import { request, METHOD } from '../../../../utils/promisfy';
import { FIELD } from '../../../../config/api.config';

const { Store, GlobalActions } = getApp();

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
      // Fetch data
      this.fetchData();
    },
    detached: function () {
      this.unsubscribe();
    },
  },

  /**
   * Component initial data
   */
  data: {
    title: [],
    action: [],
    articles: []
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
    fetchData: function () {
      request(FIELD.FEED, METHOD.GET)
        .then(res => this.setData({ ...res }));
    },
    feedback
  }
})
