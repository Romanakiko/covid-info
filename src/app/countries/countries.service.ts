import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CountryGeometry, GeoJSON} from "./countries";
import {Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

//  TODO: URL to proxy
  private getGeoJson(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>("https://s3.amazonaws.com/rawstore.datahub.io/23f420f929e0e09c39d916b8aaa166fb.geojson");
  }

  public getCountries$ = this.getGeoJson().pipe(
      switchMap((data) => of(data.features.map(country => (<CountryGeometry>{
          name: country.properties.ADMIN,
          coordinates: this.reverseLngLat(country.geometry.coordinates)
        })))
      ));

  private reverseLngLat( coordinates: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
    if(typeof coordinates[0] === "number") {
      return coordinates;
    }
    else if(typeof coordinates[0][0] === "number") {
      return coordinates.map(coord => (coord as number[]).reverse());
    }
    else {
      return coordinates.map(coords => this.reverseLngLat(coords as number[] | number[][] | number[][][])) as number[] | number[][] | number[][][];
    }
  }

}
