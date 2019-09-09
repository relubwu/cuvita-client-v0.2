import reducers from '/reducers';
import reduxThunk from 'redux-thunk';
import * as redux from 'redux';
import * as GlobalActions from '/actions';
import * as GlobalLocalePackage from '/locale-package';
import * as promisfy from 'lib/wx.promisfy';
import logger from 'redux-logger';

const Store = redux.createStore(reducers, redux.applyMiddleware(logger, reduxThunk));
// const Store = redux.createStore(reducers, redux.applyMiddleware(reduxThunk));

App({
  Store,
  GlobalActions,
  GlobalLocalePackage,
  onLaunch: function () {
    wx.showLoading({
      title: this.GlobalLocalePackage.loading[Store.getState().global.locale],
      mask: true
    });
    // Synchronous core systemInfo
    Store.dispatch(GlobalActions.setLocale(wx.getStorageSync('locale')));
    Store.dispatch(GlobalActions.setSystemInfo(wx.getSystemInfoSync()));
    // Acquire user token
    promisfy.login()
      .then(code => promisfy.fetch(`/dispatch/${ code }`))
      .then(({ data: { openid, user, member } }) => {
        Store.dispatch(GlobalActions.setUser({ openid, ...user }));
        wx.hideLoading();
        if (!!member) {
          Store.dispatch(GlobalActions.updateMember(member));
        } else if (!!Store.getState().global.member) {
          Store.dispatch(GlobalActions.purgeMember());
        }
      });
  }
})