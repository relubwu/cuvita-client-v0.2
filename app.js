import { request, METHOD, login, getNetworkType } from 'utils/promisfy';
import { applyMiddleware, createStore } from 'lib/redux.min';
import ReduxThunk from 'redux-thunk';
import reducers from '/reducers';
import * as GlobalActions from '/actions';
import * as API from '/config/api.config';
import logger from 'redux-logger';

const Store = createStore(reducers, applyMiddleware(logger, ReduxThunk));

App({
  Store,
  GlobalActions,
  onLaunch: function () {
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
        if (!!member)
          Store.dispatch(GlobalActions.updateMember(member));
        else
          Store.dispatch(GlobalActions.purgeMember());
      })
      .catch(e => console.error(e));
  },
  onNetworkStatusChange() {
    wx.onNetworkStatusChange(({ networkType }) => {
      Store.dispatch(GlobalActions.setNetworkStatus(networkType));
    });
  }
})