import palette from '../../config/palette.config';
import autofiller from '../../utils/form-autofiller';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    this.setData({
      locale,
      fields: [
        [
          { tag: 'van-field', name: 'name', type: 'text', label: localePackage.name.label[locale], placeholder: localePackage.name.placeholder[locale], required: true },
          { tag: 'van-field', name: 'tel', type: 'text', label: localePackage.tel.label[locale], placeholder: localePackage.tel.placeholder[locale], required: true },
          { tag: 'van-field', name: 'email', type: 'text', label: localePackage.email.label[locale], placeholder: localePackage.email.placeholder[locale], required: true, is: 'email' },
          { tag: 'van-picker', name: 'school', title: localePackage.school.label[locale], required: true },
          { tag: 'van-picker', name: 'gender', options: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][locale], values: [0, 1, 2], title: localePackage.gender.label[locale], required: true, is: 'integer' },
          { tag: 'van-datetime-picker', name: 'birthday', title: localePackage.birthday.label[locale], options: { minDate: new Date(1990, 0, 1).getTime(), maxDate: new Date().getTime() }, required: true, is: 'date' }
        ]
      ]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale],
      mask: true
    });
    promisfy.fetch(`/school`)
      .then(({ data }) => {
        let schoolMatrix = [];
        let schoolValues = []
        data.map(v => {
          schoolMatrix.push(v.name[locale]);
          schoolValues.push(v.alias);
        });
        this.setData({
          ['fields[0][3].options']: schoolMatrix,
          ['fields[0][3].values']: schoolValues
        });
        return data;
      })
      .then(schools => {
        let fill = autofiller([ 'name', 'tel', 'email', 'school', 'gender', 'birthday' ], Store.getState().global.member);
        for (let index in schools)
          if (fill.school === schools[index].alias) fill.school = schools[index].name[this.data.locale]
        this.setData({
          ['fields[0][0].value']: fill.name,
          ['fields[0][1].value']: fill.tel,
          ['fields[0][2].value']: fill.email,
          ['fields[0][3].label']: fill.school,
          ['fields[0][4].label']: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][this.data.locale][fill.gender],
          ['fields[0][5].label']: new Date(fill.birthday).toLocaleDateString()
        })
      })
    wx.setNavigationBarTitle({
      title: localePackage.title[Store.getState().global.locale]
    });
  },
  onSubmit: function ({ detail }) {
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale] });
    promisfy.post('/member/register', { ...detail, openid: Store.getState().global.user.openid })
      .then(({ data }) => {
        wx.hideLoading();
      })
  }
})