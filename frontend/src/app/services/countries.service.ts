import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../pages/countries/countries.component';

@Injectable({
    providedIn: 'root'
})

export class CountryService {
    private apiUrl = 'http://localhost:1337/country';

    constructor(private http: HttpClient) {}

    getCountries(formData: FormData): Observable<Country[]> {
        return this.http.post<Country[]>(this.apiUrl, formData);
    }

    getCountryById(id: string): Observable<Country> {
        return this.http.get<Country>(`${this.apiUrl}/${id}`);
    }

    groupByLanguage(): Observable<Country[]> {
        return this.http.get<Country[]>(`${this.apiUrl}/language`);
    }
}