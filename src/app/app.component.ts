import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lanas-world-map-app';
  selectedCountry: any = null;
  displayCountryInfo(countryData: any): void {
    this.selectedCountry = countryData; // Update this with the data received from the event
  }
}
