import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "src/common/components/loader/loader";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, CommonModule, LoaderComponent, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'e-dossier';
  protected isUserAuthenticated: boolean = false;
  protected showBackButton: boolean = true;

  constructor(private router: Router, private userService: UserService, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(isAuthenticated => this.isUserAuthenticated = isAuthenticated);
    
    // Listen to router events to determine if back button should be shown
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showBackButton = !event.url.includes('dashboard');
    });
  }

  logout() {
    this.userService.setIsAuthenticated(false);
    // remove data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.router.navigate(['/auth'], { replaceUrl: true });
  }

  goBack() {
    // Check if there's a custom goBack function (for officer-details-layout)
    if ((window as any).appGoBack) {
      (window as any).appGoBack();
    } else {
      history.back();
    }
  }
}
