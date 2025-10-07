import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '@app/user.service';
import { Router } from '@angular/router';
import { userType } from '../authentication.const';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  protected showInvalidCredentialsError = false;
  protected userType: userType = null;
  protected isPasswordVisible: boolean = false;

  constructor(private authenticationService: AuthenticationService, private userService: UserService, private router: Router) {
    this.loginForm.valueChanges.subscribe(() => {
      if(this.showInvalidCredentialsError) {
        this.showInvalidCredentialsError = false;
      }
    })
    this.userService.user.subscribe((user) => {
      this.userType = user;
    })
    this.userService.setIsAuthenticated(false);
  }

  public onSubmit(event : SubmitEvent) {
    event.preventDefault();
    if(this.loginForm.valid) {
      const isAuthenticated = this.authenticationService.authenticate(this.loginForm.value.username!, this.loginForm.value.password!)
      if(isAuthenticated) {
          this.userService.setIsAuthenticated(isAuthenticated);
          this.router.navigate(['/dashboard', this.userType]);
      } else {
        this.showInvalidCredentialsError = true;
      }
    }
  }
}
