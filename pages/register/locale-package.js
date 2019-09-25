export const title = ['注册VITA会员', 'Register'];
export const stages = [
  ["填写信息", "Information"],
  ["支付", "Payment"],
  ["完成注册", "Complete"]
]
export const transaction = {
  pending: ['请在弹窗内完成支付', 'Please proceed to complete transaction'],
  verifying: ['核验支付结果中', 'Verifying transaction']
}
export const success = {
  header: ['欢迎您的加入!', 'Welcome!'],
  message: ['感谢您选择了VITA，我们将竭诚为您带来丰富多彩的会员福利', 'Thank you for choosing VITA, we sincerely wish you enjoy your membership benefits'],
  exit: ['开启会员之旅', 'To VITA & Beyond!']
}
export const fail = {
  modal: {
    title: ['注册失败', 'Something went wrong'],
    content: ['我们未能确认您的交易信息。如果您确认已完成了支付，请联系客服并提供您的交易单号：', "We're unable to confirm your transactions, please contact customer services with reference: "]
  },
  toast: {
    unexpected: ['注册失败，请联系客服获取详情', 'Oops! Something went wrong, please contact customer services'],
    payment: ['支付失败', 'Payment Failed']
  }
}
export const form = {
  gender: {
    label: ['性别', 'Gender'],
    placeholder: ['请点击选择性别', ''],
  },
  name: {
    label: ['姓名', 'Name'],
    placeholder: ['请输入姓名', 'John Appleseed']
  },
  tel: {
    label: ['电话', 'Mobile.'],
    placeholder: ['请输入手机号码', '(000) 000 0000']
  },
  email: {
    label: ['邮箱', 'E-mail'],
    placeholder: ['请输入电子邮箱地址', 'example@email.com']
  },
  birthday: {
    label: ['生日', 'Birthday'],
    placeholder: ['请点击选择生日', '']
  },
  school: {
    label: ['就读学校', 'School'],
    placeholder: ['请点击选择就读学校', '']
  },
  submit: ['提交并前往支付', 'Submit & Payment']
}
export const misc = {
  prev: ['上一步', 'Back'],
  contact: ['联系客服', 'Customer Services']
}
