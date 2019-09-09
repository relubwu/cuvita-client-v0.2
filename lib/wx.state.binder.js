import nestedProperty from 'nested-property';

export default function (Store, instance, fields) {
  let newState = Store.getState();
  for (let field of Object.keys(fields)) {
    let newValue = nestedProperty.get(newState, fields[field]);
    if (instance.data[field] !== newValue)
      instance.setData({ [field]: newValue });
  }
}