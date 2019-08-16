export default function autofiller (fields, feed) {
  let result = {};
  for (let field of fields) {
    // Don't use boolean shorthand, gender & region contains [0, 1]
    if (feed[field.alias] != null) {
      result[field.key] = feed[field.alias];
    }
  }
  return result;
}