import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailsComponent } from './details/details.component';
import { Country } from './pages/countries/countries.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openDetailsDialog(country: Country): MatDialogRef<DetailsComponent> {
        return this.dialog.open(DetailsComponent, {
            width: '500px',
            data: country
        });
    }
}