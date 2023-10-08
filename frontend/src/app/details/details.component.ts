import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from '../pages/countries/countries.component';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CountryService } from '../services/countries.service';

@Component({
  selector: 'app-country-details-dialog',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'] // Import the appropriate style file
})
export class DetailsComponent implements OnInit {
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public country: Country,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private countryService: CountryService,
  ) {}

  ngOnInit() {
    if (this.country) {
      const id = this.country.ccn3;
      this.fetchCountryDetails(id);
    }
  }

  fetchCountryDetails(id: string) {
    this.countryService.getCountryById(id).subscribe(
      (data: Country) => {
        if (data) {
          this.country = data;
        }
        this.loading = false; // Hide the loader after data is loaded
      },
      error => {
        console.error('Error fetching country details:', error);
        this.loading = false; // Hide the loader in case of an error
      }
    );
  }

  getMapUrl(country: Country): SafeResourceUrl | null {
    if (this.country && this.country.latitude && this.country.longitude) {
      const apiKey = 'AIzaSyDJSM6G62g5UZolpoNuD-HkuYojAjvDvSc';  // Replace with your actual Google Maps API key
      const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${this.country.latitude},${this.country.longitude}&zoom=5`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }
}