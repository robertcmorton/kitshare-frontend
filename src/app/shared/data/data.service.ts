import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private snackBar: MatSnackBar) {}
  dropdownsOpenedCount = 0;
  openSnackBar(message: string, panelClass = "snack-success", action?) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: panelClass,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
