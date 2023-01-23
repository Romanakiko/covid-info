import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Covid, CovidDetails} from "./covid";
import {buffer, bufferCount, combineAll, combineLatestAll, from, map, mergeMap, of, switchMap, tap} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private http: HttpClient) { }

  //  TODO: URL to proxy
  // https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true
//  TODO: make countable buffer
  public getCovidInfoByCountries() {
    let buffer = 0;
    return this.http.get<Covid[]>("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true").pipe(
      switchMap(countries => {
        buffer = countries.length;
        console.log(buffer);
        return from(countries);
      }),
      mergeMap( country =>
    this.http.get<CovidDetails>(country.moreData).pipe(
      map(details => (<Covid>{
        infected: details.infected || country.tested,
        tested: details.tested || country.tested,
        recovered: details.recovered || country.recovered,
        deceased: details.deceased || country.deceased,
        country: country.country,
        moreData: country.moreData,
        historyData: country.historyData,
        lastUpdatedApify: details.lastUpdatedAtApify || country.lastUpdatedApify
      }))
    )),
     bufferCount(45));
    // return this.http.get<Covid[]>("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true").pipe(
    //   mergeMap((countries) => {
    //     // countries.map(i => console.log(i));
    //     return of(countries.map(country => {
    //       let info!: CovidDetails;
    //       this.http.get<CovidDetails>(country.moreData).subscribe((details) => {
    //         info = details;
    //         console.log("country:");
    //         console.log(country);
    //         console.log("details:");
    //         console.log(details);
    //       });
    //       console.log("info:");
    //       console.log(info);
    //       return {
    //           infected: info.infected,
    //           tested: info.tested || country.tested,
    //           recovered: info.recovered || country.recovered,
    //           deceased: info.deceased || country.deceased,
    //           country: country.country,
    //           moreData: country.moreData,
    //           historyData: country.historyData,
    //           lastUpdatedApify: country.lastUpdatedApify
    //         }
    //       }))
    //   }));
  }

}
