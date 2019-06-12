import { request, METHOD, getNetworkType } from 'utils/promisfy';
import { applyMiddleware, createStore } from 'lib/redux.min';
import ReduxThunk from 'redux-thunk';
import reducers from '/reducers';
import * as GlobalActions from '/actions';
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
    // Asynchronous dispatch sequence
    getNetworkType()
      .then(res => {
        Store.dispatch(GlobalActions.setNetworkStatus(res));
      });
    // Event subscribers
    this.onNetworkStatusChange();
  },
  onNetworkStatusChange() {
    wx.onNetworkStatusChange(({ networkType }) => {
      Store.dispatch(GlobalActions.setNetworkStatus(networkType));
    });
  }
})