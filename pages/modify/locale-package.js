import * as LocalePackage from '../register/locale-package';

export const { name, gender, tel, email, region, birthday } = LocalePackage;

export const title = ["会员信息", "Membership"];
export const header = ["修改会员信息", "Information"];
export const description = ["完善您的会员信息，以便VITA更好地为您提供服务", "Implement your membership detail"]
export const submit = ["确认", "Update"];
export const modal = {
  success: {
    title: ['提交成功', 'Success!'],
    content: ['您的会员信息已记录在案', 'Your membership detail is updated']
  }
}