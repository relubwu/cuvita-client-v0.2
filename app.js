import { request, METHOD, getSystemInfo, getNetworkType } from 'utils/promisfy';
import { applyMiddleware, createStore } from 'lib/redux.min';
import ReduxThunk from 'redux-thunk';
import reducers from '/reducers';
import * as globalActions from '/actions';
import logger from 'redux-logger';

const store = createStore(reducers, applyMiddleware(logger, ReduxThunk));

App({
  store,
  globalActions,
  onLaunch: function () {
    this.onAppRoute();
    this.onNetworkStatusChange();
    // request('/', METHOD.GET);
    getSystemInfo()
      .then(res => {
        store.dispatch(globalActions.setSystemInfo(res));
      });
    getNetworkType()
      .then(res => {
        store.dispatch(globalActions.setNetworkStatus(res));
      })
  },
  onAppRoute() {
    wx.onAppRoute(res => {
      res.openType !== 'appLaunch' && store.dispatch(globalActions.switchPage(res.path, getCurrentPages().length - 1));
    });
  },
  onNetworkStatusChange() {
    wx.onNetworkStatusChange(({ networkType }) => {
      store.dispatch(globalActions.setNetworkStatus(networkType));
    });
  }
})