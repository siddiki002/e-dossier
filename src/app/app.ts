import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'e-dossier';
  protected isUserAuthenticated: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(isAuthenticated => this.isUserAuthenticated = isAuthenticated);
  }

  logout() {
    this.userService.setIsAuthenticated(false);
    this.router.navigate(['/auth'], { replaceUrl: true });
  }
}
