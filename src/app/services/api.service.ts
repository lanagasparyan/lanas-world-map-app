import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.worldbank.org/v2';

  constructor(private http: HttpClient) { }

  getCountryInfoFromWorldbank(countryId: string): Observable<any> {
    const countryInfoUrl = `${this.baseUrl}/country/${countryId}?format=json`;
    const populationInfoUrl = `${this.baseUrl}/country/${countryId}/indicator/SP.POP.TOTL?format=json`;
    const gdpInfoUrl = `${this.baseUrl}/country/${countryId}/indicator/NY.GDP.MKTP.CD?format=json`;

    return forkJoin({
      countryData: this.http.get<any>(countryInfoUrl),
      populationData: this.http.get<any>(populationInfoUrl),
      gdpData: this.http.get<any>(gdpInfoUrl)
    }).pipe(
      map(results => {
        // Use type assertions to inform TypeScript about the structure of the data
        const populationArray = results.populationData[1] as Array<any>;
        const countryDataArray = results.countryData[1] as Array<any>;
        const gdpArray = results.gdpData[1] as Array<any>;

        if (populationArray.length > 0 && countryDataArray.length > 0) {
          const population = populationArray[0].value; // Adjust based on actual structure
          const gdp = gdpArray[0].value; // Adjust based on actual structure
          const countryData = countryDataArray[0]; // Adjust if needed
          countryData.population = population; // Add population data to country data
          countryData.gdp = gdp; // Add GDP data to country data
          return countryData; // Return the modified country data
        }
        return null; // Or handle this case as appropriate
      })
    );
  }
}
