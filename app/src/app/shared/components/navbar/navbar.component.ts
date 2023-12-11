import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {}

  logout() {}

  routeReport() {
    this.router.navigateByUrl('/reports');
  }
}
