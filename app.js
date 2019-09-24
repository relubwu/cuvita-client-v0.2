import reducers from '/reducers';
import reduxThunk from 'redux-thunk';
import * as redux from 'redux';
import * as GlobalActions from '/actions';
import * as GlobalLocalePackage from '/locale-package';
import * as promisfy from 'lib/wx.promisfy';
import logger from 'redux-logger';

const Store = redux.createStore(reducers, redux.applyMiddleware(logger, reduxThunk)); // 开发环境下开启logger
// const Store = redux.createStore(reducers, redux.applyMiddleware(reduxThunk)); // 生产环境屏蔽logger输出

App({
  Store,
  GlobalActions,
  GlobalLocalePackage,
  onLaunch: function () {
    wx.showLoading({
      title: this.GlobalLocalePackage.loading[Store.getState().global.locale],
      mask: true
    });
    Store.dispatch(GlobalActions.setSystemInfo(wx.getSystemInfoSync()));
    Store.dispatch(GlobalActions.setLocale(wx.getStorageSync('locale') || 0));
    Store.dispatch(GlobalActions.setMember(wx.getStorageSync('member') || null));
    promisfy.login()
      .then(code => promisfy.fetch(`/dispatch/${ code }`))
      .then(({ user, member }) => {
        Store.dispatch(GlobalActions.setUser(user));
        member ? Store.dispatch(GlobalActions.updateMember(member)) : Store.getState().global.member && Store.dispatch(GlobalActions.purgeMember());
        wx.hideLoading();
      });
  }
})