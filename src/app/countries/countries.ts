export interface GeoJSON {
  type: string,
  features: Countries[]
}

export interface Countries {
  type: string,
  properties: GeoProperties,
  geometry: GeoGeometry
}

export interface GeoProperties {
  ADMIN: string,
  ISO_A3: string
}

export interface GeoGeometry {
  type: string,
  coordinates: number[] | number[][] | number[][][]
}

export interface CountryGeometry {
  name: string,
  coordinates: number[] | number[][] | number[][][]
}
