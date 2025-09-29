import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  protected imagePath = '@public/Navy Icon.png';

  constructor() {
    this.loginForm.valueChanges.subscribe(status => console.log(status));
  }

  public onSubmit(event : SubmitEvent) {
    event.preventDefault();
    console.log(this.loginForm.value);
    console.log(this.loginForm.controls.password.errors);
  }
}
