export default function sanitizer (payload, rules) {
  let failedItems = {};
  for (let key in payload) {
    switch (rules[key]) {
      case 'avail': 
        if (!payload[key] || payload[key].length == 0)
          failedItems = { ...failedItems, [key]: 'empty' };
        break;
      default:
        break;
    } 
  }
  return { 
    clearance: Object.keys(failedItems).length == 0, 
    failedItems
  }
}