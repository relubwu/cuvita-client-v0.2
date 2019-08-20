import Regions from '../config/region.config';

export function mapRegionToMatrix () {
  let regionMatrix = [[], []];
  Regions.map(v => {
    regionMatrix[0].push(v.name[0]);
    regionMatrix[1].push(v.name[1]);
  });
  return regionMatrix;
}

export function mapIndexToRegion (index) {
  return Regions[index];
}

export function mapRegionIdToIndex (id) {
  for (let index in Regions)
    if (Regions[index].id === id)
      return index;
  return -1;
}

export function mapRegionIdToName (id) {
  for (let index in Regions)
    if (Regions[index].id === id)
      return Regions[index].name;
  return [];
}

export function mapRegionToMarkerArray () {
  let array = [];
  for (let index in Regions) {
    array.push({
      id: index,
      iconPath: `https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/region_pin_${ index }.png`,
      width: 40,
      height: 40,
      index,
      latitude: Regions[index].geoLocation.lat,
      longitude: Regions[index].geoLocation.long,
      zIndex: Regions.length - index
    });
  }
  return array;
}