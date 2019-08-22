import * as Actions from 'actions';
import services from '../../config/services.config';
import { request, METHOD, getLocation } from '../../utils/promisfy';
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
    if (!!options.preventLocate)
      return this.fetchData();
    getLocation()
      .then(({ latitude, longitude }) => {
        return request(FIELD.REGION, METHOD.GET, { lat: latitude, long: longitude })
      })
      .then(({ id }) => {
        Store.dispatch(GlobalActions.setRegion(id));
        this.fetchData();
      })
      .catch(e => { });
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
  fetchData: function () {
    let region = this.data.region;
    Promise.all([
      request(FIELD.BANNER, METHOD.GET, { region }),
      request(FIELD.SERVICES, METHOD.GET),
      request(FIELD.RECOMMENDATION, METHOD.GET, { region }),
      request(FIELD.FEED, METHOD.GET, { region })
    ])
      .then(res => {
        Store.dispatch(Actions.updateServices(res[1]));
        this.setData({
          banner: res[0],
          recommendations: res[2],
          feed: res[3]
        });
      });
  },
  feedback
})