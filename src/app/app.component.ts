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
  Map,
  Marker, LatLngExpression
} from "leaflet";
import * as L from "leaflet"
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
    this.setCovidInfo();
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
        .setStyle({fillColor: this.countryColor(country.name)})));
    return res;
  }

  setCovidInfo(): void {
    this.covidService.getCovidInfoByCountries().subscribe(countries => {
      this.covidInfo = countries;
      this.increment = 100 / Math.max(... countries.map(c => c.infected).filter(val => val && val > 0));
      this.setColorsDone = true;
      console.log(this.covidInfo);
    });
  }

  countryColor(country: string): string  {
    let countryInfo = this.covidInfo.find(c => c.country === country);
      if(countryInfo && countryInfo.infected && countryInfo.infected > 0) {
        console.log(countryInfo!.country);
        console.log(Math.trunc(this.increment * countryInfo.infected));

        return this.getColor(Math.trunc(this.increment * countryInfo.infected));
      }
      else return '#cbffbf';
  }

  getColor = (d: number) => {
    return d > 70 ? '#ec0c0c' :
      d > 50 ? '#f64e14' :
        d > 30 ? '#ff9423' :
          d > 20 ? '#ffda3a' :
            d > 10 ? '#ffff5c' :
              d > 5 ? '#f3ff8d' :
                d > 1 ? '#d7ffa7' :
                  '#cbffbf';
  }

  onMapReady(map: Map) {

    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = map => {
      let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 5, 10, 20, 30, 50, 70],
        increment = 36718053 / 100000,
        labels = [],
        from, to;

      for (let i = 0; i < grades.length; i++) {
        from = Math.trunc(grades[i] * increment);
        to = Math.trunc(grades[i + 1] * increment);

        labels.push(
          '<i style="background:' + this.getColor(grades[i]) + '"></i> ' +
          from + 'k'+ (to ? '&ndash;' + to + 'k' : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  }


  }
