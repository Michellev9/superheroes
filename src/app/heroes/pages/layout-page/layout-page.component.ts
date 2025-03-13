import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  standalone: false,
  
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: '/heroes/list' },  // ✅ Correcto
    { label: 'Añadir', icon: 'add', url: '/heroes/new-page' }, // ✅ Correcto
    { label: 'Buscar', icon: 'search', url: '/heroes/search' } // ✅ Correcto
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user():User | undefined {
    return this.authService.CurrentUser;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


}