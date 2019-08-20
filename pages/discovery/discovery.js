import * as Actions from 'actions';
import services from '../../config/services.config';
import { request, METHOD } from '../../utils/promisfy';
import { FIELD } from '../../config/api.config';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    scrollTop: 0
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
    if (this.data.region !== newState.global.region)
      this.setData({
        region: newState.global.region
      });
  },
  onLoad: function (options) {
    // Synchronous storage hook
    let { locale, systemInfo, region } = Store.getState().global
    this.setData({
      locale, systemInfo, region
    });
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    request(FIELD.BANNER, METHOD.GET, { region })
      .then(banner => {
        this.setData({ banner })
      });
    request(FIELD.SERVICES, METHOD.GET)
      .then(targets => {
        Store.dispatch(Actions.updateServices(targets));
      });
  },
  onScroll: function ({ detail: { scrollTop } }) {
    if (this.data.scrollTop > -this.data.systemInfo.screenWidth * 1.2 && scrollTop <= -this.data.systemInfo.screenWidth * 1.2)
      this.feedback();
    this.setData({
      scrollTop
    });
  },
  onUnLoad: function () {
    this.unsubscribe();
  },
  feedback
})