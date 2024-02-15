import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  svgContent!: SafeHtml;
  selectedCountryInfo: any = null;
  selectedCountryPopulation: any = null;
  @Output() countrySelected = new EventEmitter<any>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSvg();
  }

  loadSvg(): void {
    this.http.get('assets/svg/world-map.svg', { responseType: 'text' }).subscribe((svg: string) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      setTimeout(() => {
        this.addHoverEffectsAndRandomColors();
      });
    });
  }

  addHoverEffectsAndRandomColors(): void {
    const svgElement: SVGElement = this.svgContainer.nativeElement.querySelector('svg');
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      // Set a random dark color on load
      path.style.fill = this.generateRandomDarkColor();

      // Add hover effects
      path.addEventListener('mouseenter', this.onMouseEnter);
      path.addEventListener('mouseleave', this.onMouseLeave.bind(this, path.style.fill)); // Bind the original color
    });
  }

  onMouseEnter(event: MouseEvent): void {
    const element = event.target as SVGElement;
    element.style.fill = '#ffcccc'; // Change fill color on hover
  }

  onMouseLeave(originalColor: string, event: MouseEvent): void {
    const element = event.target as SVGElement;
    element.style.fill = originalColor; // Reset to the original random color on mouse leave
  }

  ngOnDestroy(): void {
    // Remove event listeners to prevent memory leaks
    const svgElement: SVGElement = this.svgContainer.nativeElement.querySelector('svg');
    if (svgElement) {
      const paths = svgElement.querySelectorAll('path');
      paths.forEach(path => {
        path.removeEventListener('mouseenter', this.onMouseEnter);
        path.removeEventListener('mouseleave', this.onMouseLeave.bind(this, path.style.fill));
      });
    }
  }

  generateRandomDarkColor(): string {
    // Generate a random dark color
    const r = Math.floor(Math.random() * 175);
    const g = Math.floor(Math.random() * 175);
    const b = Math.floor(Math.random() * 175);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  onCountryClick(event: MouseEvent): void {
    const clickedElement = event.target as SVGElement;
    const countryCode = clickedElement.getAttribute('id');

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
