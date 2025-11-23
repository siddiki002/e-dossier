import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDivider } from "@angular/material/divider";
import { UserService } from "@app/user.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'officer-details-layout',
    templateUrl: './officer-details-layout.component.html',
    styleUrl: './officer-details-layout.component.css',
    imports: [RouterModule, MatSidenavModule, MatDivider, CommonModule]
})
export class OfficerDetailsLayoutComponent implements OnInit, OnDestroy {

    protected isOic: boolean = false;
    private originalGoBack: () => void;

    constructor(private userService: UserService, private router: Router) {
        this.userService.userType.subscribe(role => {
            this.isOic = (role === 'oic');
        });

        // Store the original goBack function
        this.originalGoBack = (window as any).appGoBack || (() => history.back());
    }

    ngOnInit() {
        // Override the global goBack function
        (window as any).appGoBack = this.customGoBack.bind(this);
    }

    ngOnDestroy() {
        // Restore the original goBack function when component is destroyed
        (window as any).appGoBack = this.originalGoBack;
    }

    private customGoBack(): void {
        if (this.isOic) {
            this.router.navigate(['dashboard/oic'], { replaceUrl: true });
        } else {
            this.router.navigate(['dashboard/instructor'], { replaceUrl: true });
        }
    }
}