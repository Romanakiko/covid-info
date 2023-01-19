import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CountryGeometry, GeoJSON} from "./countries";
import {LatLngExpression} from "leaflet";
import {Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

  private getGeoJson(): Observable<GeoJSON> {
    console.log("start getting data");
    return this.http.get<GeoJSON>("https://s3.amazonaws.com/rawstore.datahub.io/23f420f929e0e09c39d916b8aaa166fb.geojson");
  }

  // getCountries() {
  //   let countries: CountryGeometry[] = [];
  //   this.getGeoJson().subscribe((data) => {
  //     console.log("data:");
  //     console.log(data);
  //     data.features.forEach(country => countries.push({
  //       name: country.properties.ADMIN,
  //       coordinates: this.reverseLngLat(country.geometry.coordinates)
  //     }));
  //   })
  //   console.log("getting data - done");
  //   return countries;
  // }

  public getCountries$ = this.getGeoJson().pipe(
      switchMap((data) => new Observable<CountryGeometry[]>(geometry => {
        this.getGeoJson().subscribe(d => console.log(d));
        geometry.next(data.features.map(country => {
          return {
          name: country.properties.ADMIN,
          coordinates: this.reverseLngLat(country.geometry.coordinates)
        }
        }));
        geometry.complete();
      })));

  private reverseLngLat( coordinates: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
    if(typeof coordinates[0] === "number") {
      console.log('exit1');
      return coordinates;
    }
    else if(typeof coordinates[0][0] === "number") {
      console.log('exit2');
      return coordinates.map(coord => (coord as number[]).reverse());
    }
    else {
      console.log('exit4');
      return coordinates.map(coords => this.reverseLngLat(coords as number[] | number[][] | number[][][])) as number[] | number[][] | number[][][];
    }
    console.log('exit4');
    return coordinates;
  }

}
