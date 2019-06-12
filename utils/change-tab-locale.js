const MAP = {
  zh_CN: ["发现", "Vitae", "我"],
  en_US: ["Discovery", "Vitae", "Me"]
}
const DEFAULT_LOCALE = "zh_CN";

export default function(locale) {
  if (!locale)
    locale = DEFAULT_LOCALE;
  for (let i = 0; i < MAP[locale].length; i++)
    wx.setTabBarItem({
      index: i,
      text: MAP[locale][i]
    });
}