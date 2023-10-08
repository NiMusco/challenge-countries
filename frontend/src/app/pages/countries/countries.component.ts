import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../dialog.service';
import { CountryService } from '../../services/countries.service';

export interface Country {
  ccn3: string;
  name: string;
  capital: string;
  continents: string;
  population: string;
  currencies: string;
  flag: string;
  latitude: string;
  longitude: string;
  languages: Language[];
}

export interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})

export class CountriesComponent implements OnInit {

  loading = false;
  displayedColumns: string[] = ['flag', 'name', 'capital', 'continents', 'population', 'currencies', 'languages'];
  dataSource = new MatTableDataSource<Country>();

  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private countryService: CountryService,
  ) {}

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  ngOnInit() {
    this.handleFormSubmit({});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  handleFormSubmit(formData: any) {
    this.loading = true; // Show the loader
    this.countryService.getCountries(formData).subscribe(
      (data: Country[]) => {
        this.dataSource.data = data;
        this.loading = false; // Hide the loader once data is fetched
      },
      error => {
        console.error('Error fetching data from the API:', error);
        this.loading = false; // Hide the loader in case of an error
      }
    );
  }  

  onRowClicked(row: Country) {
    this.dialogService.openDetailsDialog(row);
  }
}
