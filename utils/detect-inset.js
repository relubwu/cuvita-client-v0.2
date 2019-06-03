/**
 * 检测iPhoneX刘海边框
 * @param model
 * @param screenHeight
 */
export default function(model, screenHeight) {
  return /iphone x/i.test(model) || (/iPhone11/i.test(model) && screenHeight === 812);
}