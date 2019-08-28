import { mapRegionToMatrix, mapRegionIdToIndex, mapRegionToMarkerArray, mapIndexToRegion } from '../../utils/region-converter';
import * as LocalePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackages } = getApp();

Page({
  data:{
    options: {
      long: -117.55,
      lat: 33.4,
      scale: 6
    }
  },
  onLoad: function () {
    let { locale, region } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale, region,
      ['options.region']: mapRegionToMatrix(),
      ['options.regionIndex']: mapRegionIdToIndex(region),
      ['options.markers']: mapRegionToMarkerArray()
    });
    wx.setNavigationBarTitle({
      title: LocalePackage.title[Store.getState().global.locale]
    });
  },
  markerTap: function ({ markerId }) {
    let { geoLocation: { long, lat } } = mapIndexToRegion(markerId);
    this.setData({
      ['options.regionIndex']: markerId,
      ['options.long']: long,
      ['options.lat']: lat,
      ['options.scale']: 10
    });
  },
  onChange: function ({ detail: { index } }) {
    let { geoLocation: { long, lat } } = mapIndexToRegion(index);
    this.setData({
      ['options.regionIndex']: index,
      ['options.long']: long,
      ['options.lat']: lat,
      ['options.scale']: 10
    });
  },
  onCancel: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  setRegion: function ({ detail: { index } }) {
    Store.dispatch(GlobalActions.setRegion(mapIndexToRegion(index).id));
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/discovery/discovery?fallback=region'
      })
    }, 500);
  }
})