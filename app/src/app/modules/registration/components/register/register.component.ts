import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRoleService } from 'src/app/services/role-service/user-role.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userForm: FormGroup;

  constructor(
    private userService: UserRoleService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe(
        (response: any) => {
          this.snackBar.open('You are registered as an interviewer', 'Close', {
            duration: 2000,
          });
        },
        (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', { duration: 2000 });
        }
      );
    }
  }
}
