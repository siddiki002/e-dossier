import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'officer-details-layout',
    templateUrl: './officer-details-layout.component.html',
    styleUrl: './officer-details-layout.component.css',
    imports: [RouterModule, MatSidenavModule, MatDivider]
})
export class OfficerDetailsLayoutComponent {

    protected isMenuOpened: boolean = false;
    
    toggleMenu() {
        this.isMenuOpened = !this.isMenuOpened;
    }
}