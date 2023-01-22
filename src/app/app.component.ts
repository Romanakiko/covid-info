import {Component, OnInit} from '@angular/core';
import {
  latLng,
  MapOptions,
  tileLayer,
  layerGroup,
  Control,
  circle,
  polygon,
  marker,
  Circle,
  Polygon,
  Marker, LatLngExpression
} from "leaflet";
import {ArrayType} from "@angular/compiler";
import {CountriesService} from "./countries/countries.service";
import {CovidService} from "./covid/covid.service";
import {Covid} from "./covid/covid";
import {CountryGeometry} from "./countries/countries";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  readonly initialColor = parseInt('ce9500', 16);
  increment = 0;
  setColorsDone = false;
  covidInfo: Covid[] = [];
  options!: MapOptions;
  layers!: (Circle<any> | Polygon<any> | Marker<any>)[];

  constructor(private countriesService: CountriesService,
              private covidService: CovidService) {
    this.setMaxColors();
  }

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 2,
      center: latLng(0, 0)
    };
    this.countriesService.getCountries$.subscribe(countries => {
      this.layers = this.setPolygons(countries);
    });

    // this.covidService.getCovidInfoByCountries().subscribe(countries => {
    //   console.log(`countries:`);
    //   console.log(countries);
    // })
  }

  setPolygons(countries: CountryGeometry[]) {
    // let coordinates = forms as (LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][])[]
    let res: Polygon<any>[] = [];
    countries.forEach(country => res.push(
      polygon(country.coordinates as (LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]))
        .setStyle({fillColor: this.getColor(country.name)})));
    return res;
  }

  setMaxColors(): void {
    this.covidService.getCovidInfoByCountries().subscribe(countries => {
      this.covidInfo = countries;
      this.increment = 255 / Math.max(... countries.map(c => c.infected).filter(val => val && val > 0));
      this.setColorsDone = true;
      console.log(this.covidInfo);
    });
  }

  getColor(country: string): string {
    console.log(this.increment);
    if(!this.setColorsDone) {
      return '#62b7b7';
    }
    let countryInfo = this.covidInfo.find(c => c.country === country);
    if(countryInfo && countryInfo.infected && countryInfo.infected > 0) {
      console.log(countryInfo!.country);
      console.log(Math.trunc(this.increment * countryInfo.infected));

      return ('#' + (this.initialColor + Math.trunc(this.increment * countryInfo.infected)).toString(16));
    }
    else return '#62b7b7';
  }
}
