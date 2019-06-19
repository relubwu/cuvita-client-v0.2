const title = ['功能开发中', 'Implementing'];

export default function (locale) {
  wx.showToast({
    title: title[locale],
    image: '/assets/icons/implementing.png'
  });
}