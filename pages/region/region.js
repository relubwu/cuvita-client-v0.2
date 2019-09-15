import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data:{
    map: {
      long: -117.55,
      lat: 33.4,
      scale: 6
    }
  },
  onLoad: function () {
    let { locale, region } = Store.getState().global;
    wx.setNavigationBarTitle({ title: localePackage.title[locale] });
    wx.showLoading({ title: GlobalLocalePackage.loading[locale] });
    promisfy.fetch(`/region`)
      .then(({ data }) => {
        let currentRegion = 0;
        for (let index in data.list) {
          if (data.list[index].alias === region.alias) currentRegion = index;
        }
        this.setData({
          locale,
          options: data.matrix,
          regions: data.list,
          currentRegion,
          ['map.markers']: data.markers
        });
        wx.hideLoading();
      });
  },
  markerTap: function ({ markerId }) {
    let { geoLocation: { long, lat } } = this.data.regions[markerId];
    this.setData({
      currentRegion: markerId,
      ['map.long']: long,
      ['map.lat']: lat,
      ['map.scale']: 10
    });
  },
  onChange: function ({ detail: { index } }) {
    let { geoLocation: { long, lat } } = this.data.regions[index];
    this.setData({
      currentRegion: index,
      ['map.long']: long,
      ['map.lat']: lat,
      ['map.scale']: 10
    });
  },
  onCancel: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  setRegion: function ({ detail: { index } }) {
    Store.dispatch(GlobalActions.setRegion(this.data.regions[index]));
    wx.reLaunch({
      url: '/pages/discovery/discovery?fallback=region'
    });
  }
})