import Palette from '../config/palette.config';

const title = ['完善您的会员信息', 'Update your Member Info'];
const content = ['帮助VITA更好地为您提供服务，请补全您的会员信息', 'Your membership detail is incomplete, please fill it out'];
const confirm = ['前往填写', 'Go']

export default function implement (member, locale) {
  let { name, gender, tel, region, birthday, email } = member;
  if (!name || gender === null || !tel || !region || !birthday || !email)
    wx.showModal({
      title: title[locale],
      content: content[locale],
      confirmColor: Palette.primary,
      success: function () {
        wx.navigateTo({
          url: '/pages/modify/modify',
        })
      },
      confirmText: confirm[locale],
      showCancel: false
    });
}