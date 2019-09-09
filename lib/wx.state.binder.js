import nestedProperty from 'nested-property';

export default function (Store, instance, fields) {
  let newState = Store.getState();
  for (let field of Object.keys(fields)) {
    let newValue = nestedProperty.get(newState, fields[field]);
    typeof instance.data[field] === 'object' ? instance.data[field] !== newValue && instance.setData({ [field]: newValue }) : JSON.stringify(instance.data[field]) !== JSON.stringify(newValue) && instance.setData({ [field]: newValue });
  }
}