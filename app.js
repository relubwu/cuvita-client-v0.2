import { request, METHOD, login, getNetworkType } from 'utils/promisfy';
import { applyMiddleware, createStore } from 'lib/redux.min';
import ReduxThunk from 'redux-thunk';
import reducers from '/reducers';
import * as GlobalActions from '/actions';
import * as GlobalLocalePackages from '/locale-package';
import * as API from '/config/api.config';
import * as Toasts from '/utils/toasts';
import logger from 'redux-logger';

const Store = createStore(reducers, applyMiddleware(logger, ReduxThunk));

App({
  Store,
  GlobalActions,
  GlobalLocalePackages,
  onLaunch: function () {
    wx.showLoading({
      title: this.GlobalLocalePackages.loading[Store.getState().global.locale],
      mask: true
    });
    // Synchronous core systemInfo
    Store
      .dispatch(
        GlobalActions.setSystemInfo(
          wx.getSystemInfoSync()
        )
      );
    // Synchronous memberInfo
    let member = wx.getStorageSync('member');
    if (!!member)
      Store
        .dispatch(
          GlobalActions.setMember(member)
        );
    // Asynchronous dispatch sequence
    getNetworkType()
      .then(res => {
        Store.dispatch(GlobalActions.setNetworkStatus(res));
      });
    // Event subscribers
    this.onNetworkStatusChange();
    // Acquire user token
    login()
      .then(code => request(API.DISPATCH, METHOD.GET, { code }))
      .then(({ openid, user, member }) => {
        Store.dispatch(GlobalActions.setUser({ openid, ...user }));
        wx.hideLoading();
        if (!!member)
          Store.dispatch(GlobalActions.updateMember(member));
        else if (!!Store.getState().global.member)
          Store.dispatch(GlobalActions.purgeMember());
      })
      .catch(e => Toasts.requestFailed(Store.getState().global.locale));
  },
  onNetworkStatusChange: function () {
    wx.onNetworkStatusChange(({ networkType }) => {
      Store.dispatch(GlobalActions.setNetworkStatus(networkType));
    });
  }
})