import validator from 'validator';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage,
    currentStage: 0,
    options: { minDate: new Date().getTime(), maxDate: new Date(2019, 8, 19).getTime() }
  },
  onLoad: function () {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo,
      stages: [
        {
          layout: {
            formBorderRadius: '50rpx 50rpx 0 0',
            formHeight: '45vh',
            formPaddingTop: '30px',
            formAction: localePackage.query[locale]
          },
          data: {

          },
          popup: {}
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`,
            formAction: localePackage.submit[locale]
          }
        }
      ]
    });
  },
  toggle: function () {
    if (this.data.currentStage !== 0) return;
    this.setData({
      [`stages[0].popup.departTime`]: !this.data.stages[0].popup.departTime
    });
  },
  confirmDateTimePicker: function ({ target: { dataset: { name } }, detail }) {
    this.setData({
      [`stages[0].popup.${name}`]: false,
      [`stages[0].data.${name}.label`]: new Date(detail).toLocaleString(),
      [`stages[0].data.${name}.value`]: detail
    });
  },
  findFlight: function ({ detail: { value: { flight, departTime } } }) {
    if (flight === null || flight.length === 0) flight = 'CA887';
    if (departTime === "") return;
    flight = flight.trim();
    flight = validator.blacklist(flight, ' ');
    flight = flight.toUpperCase();
    departTime = new Date(validator.toInt(departTime));
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    })
    promisfy.fetch(`/concierge/flight/${flight}/${departTime.getTime()}/${departTime.getTimezoneOffset()}`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        if (statusCode === 404) return wx.showToast({ title: localePackage.flight.notFound[this.data.locale], icon: 'none' });
        this.setData({
          ['stages[1].data.flights']: data,
          ['stages[1].collapse']: ['1']
        })
        this.proceed();
      });

  },
  confirmFlight: function ({ target: { dataset: { index } } }) {
    let flight = this.data.stages[1].data.flights[index];
    this.setData({
      ['stages[1].data.flight']: flight,
      ['stages[1].collapse']: []
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/concierge/destination/${ flight.destination }`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        this.setData({
          ['stages[2].data.destinations']: data,
          ['stages[2].collapse']: ['2']
        });
        this.proceed();
      });
  },
  confirmDestination: function ({ target: { dataset: { index } } }) {
    let destination = this.data.stages[2].data.destinations[index];
    let flight = this.data.stages[1].data.flight;
    this.setData({
      ['stages[2].data.destination']: destination,
      ['stages[2].collapse']: []
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/concierge/schedule/${ flight.destination }-${ destination.alias }/${ flight.arrivaltime }`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        for (let index in data) {
          data[index].departTime = new Date(data[index].departTime);
          data[index].label = data[index].departTime.toLocaleString();
        }
        this.setData({
          ['stages[3].data.schedules']: data,
          ['stages[3].collapse']: ['3']
        });
        this.proceed();
      });
  },
  confirmSchedule: function ({ target: { dataset: { index } } }) {
    let schedule = this.data.stages[3].data.schedules[index];
    this.setData({
      ['stages[3].data.schedule']: schedule,
      ['stages[3].collapse']: []
    });
    this.proceed();
  },
  proceed: function () {
     this.data.currentStage < this.data.stages.length - 1 && this.setData({ currentStage: this.data.currentStage + 1 });
  }
})