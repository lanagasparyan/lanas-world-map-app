import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.worldbank.org/v2'; // Replace with the actual Worldbank API URL

  constructor(private http: HttpClient) { }

  getCountryInfoFromWorldbank(countryId: string): Observable<any> {
    // Construct the URL for the specific country data
    const url = `${this.baseUrl}/country/${countryId}?format=json`;

    // Make an HTTP GET request to the Worldbank API and return the response as an Observable
    return this.http.get(url);
  }
}
