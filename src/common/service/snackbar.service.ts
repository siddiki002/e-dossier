import { Injectable } from "@angular/core";
import { Intent } from "../common.types";
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root'})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar){}

		private _snackBarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

    public showMessage(message: string, intent: Intent , action? : string) {
			this._snackBarRef = this.snackBar.open(message, action , {
					duration: 3000,
					panelClass: [`snackbar-${intent}`],
					verticalPosition: 'top'
			});
    }

		public get snackBarRef(): MatSnackBarRef<any> | null {
			return this._snackBarRef;
		}
}