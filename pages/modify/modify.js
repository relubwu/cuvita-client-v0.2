import palette from '../../config/palette.config';
import autofiller from '../../utils/form-autofiller';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();
const minimumAge = 16;

Page({
  data: {
    localePackage
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    wx.setNavigationBarTitle({
      title: localePackage.title[Store.getState().global.locale]
    });
    this.setData({
      locale,
      fields: [
        [
          { tag: 'van-field', name: 'name', type: 'text', label: localePackage.form.name.label[locale], placeholder: localePackage.form.name.placeholder[locale], required: true },
          { tag: 'van-field', name: 'tel', type: 'number', label: localePackage.form.tel.label[locale], placeholder: localePackage.form.tel.placeholder[locale], required: true },
          { tag: 'van-field', name: 'email', type: 'text', label: localePackage.form.email.label[locale], placeholder: localePackage.form.email.placeholder[locale], required: true, is: 'email' },
          { tag: 'van-picker', name: 'school', title: localePackage.form.school.label[locale], required: true },
          { tag: 'van-picker', name: 'gender', options: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][locale], values: [0, 1, 2], title: localePackage.form.gender.label[locale], required: true, is: 'integer' },
          { tag: 'van-datetime-picker', name: 'birthday', title: localePackage.form.birthday.label[locale], options: { minDate: new Date(1960, 0, 1).getTime(), maxDate: new Date().setFullYear(new Date().getFullYear() - minimumAge) }, required: true, is: 'date'  }
        ]
      ]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale],
      mask: true
    });
    Promise.all([
      promisfy.fetch(`/member/${ Store.getState().global.user.openid }`),
      promisfy.fetch(`/school`)
    ])
      .then(res => {
        let member = res[0];
        let school = res[1];
        let fill = autofiller(['name', 'tel', 'email', 'school', 'gender', 'birthday'], member);
        fill.school = { alias: fill.school };
        for (let index in school.list)
          if (school.list[index].alias === fill.school.alias) fill.school.name = school.list[index].name;
        this.setData({
          ['fields[0][0].value']: fill.name,
          ['fields[0][1].value']: fill.tel,
          ['fields[0][2].value']: fill.email,
          ['fields[0][3].value']: fill.school.alias,
          ['fields[0][3].label']: fill.school.name[this.data.locale],
          ['fields[0][3].options']: school.matrix[this.data.locale],
          ['fields[0][3].values']: school.values,
          ['fields[0][4].value']: fill.gender,
          ['fields[0][4].label']: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][this.data.locale][fill.gender],
          ['fields[0][5].value']: new Date(fill.birthday).getTime(),
          ['fields[0][5].label']: new Date(fill.birthday).toLocaleDateString()
        });
        wx.hideLoading();
      });
  },
  onSubmit: function ({ detail }) {
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale] });
    promisfy.post('/member/modify', { ...detail, openid: Store.getState().global.user.openid })
      .then(data => {
        wx.hideLoading();
        wx.showToast({
          title: localePackage.success[this.data.locale],
          icon: "success"
        });
      });
  }
})