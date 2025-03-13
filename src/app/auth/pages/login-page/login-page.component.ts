import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,
  
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(
    private authSevice: AuthService,
    private router: Router
  ){}

  onLogin(): void{
    this.authSevice.login('michellevg@gmail.com', '123456')
    .subscribe(user =>{
      this.router.navigate(['/'])
    });
  }
}
