import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from '../pages/countries/countries.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-country-details-dialog',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'] // Import the appropriate style file
})
export class DetailsComponent implements OnInit {
  loading = true;
  apiUrl = 'http://localhost:1337/country/';

  constructor(
    @Inject(MAT_DIALOG_DATA) public country: Country,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (this.country) {
      const id = this.country.ccn3;
      this.fetchCountryDetails(id);
    }
  }

  fetchCountryDetails(id: string) {
    const url = `${this.apiUrl}${id}`;
    this.http.get<Country[]>(url).subscribe(
      (data: Country[]) => {
        if (data.length > 0) {
          this.country = data[0];
        }
        this.loading = false; // Hide the loader after data is loaded
      },
      error => {
        console.error('Error fetching country details:', error);
        this.loading = false; // Hide the loader in case of an error
      }
    );
  }
}