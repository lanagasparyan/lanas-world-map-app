import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  svgContent!: SafeHtml;
  selectedCountryInfo: any = null; // Property to store the country information
  @Output() countrySelected = new EventEmitter<any>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSvg();
  }

  loadSvg(): void {
    this.http.get('assets/svg/world-map.svg', { responseType: 'text' }).subscribe((svg: string) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }

  onCountryClick(event: MouseEvent): void {
    const clickedElement = event.target as SVGElement;
    const countryCode = clickedElement.getAttribute('data-country-code');

    if (countryCode) {
      this.apiService.getCountryInfoFromWorldbank(countryCode).subscribe(
        (data: any) => {
          this.selectedCountryInfo = data; // Update the component property with the fetched data
          // Further processing of the data can be done here if needed
          this.countrySelected.emit(data);
          console.log('Country data:', data);
        },
        (error) => {
          console.error('Error fetching country data:', error);
          // Optionally, handle errors here (e.g., reset selectedCountryInfo or show an error message)
          this.selectedCountryInfo = null;
        }
      );
    } else {
      console.error('No country code found on clicked element');
      this.selectedCountryInfo = null; // Reset the info if no country code is found
    }
  }

}
