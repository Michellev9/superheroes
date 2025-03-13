import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from "@angular/router";
import { AuthService } from "../service/auth.service";
import { Observable, of } from "rxjs";
import { tap, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PublicGuard implements CanMatch, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private checkIfPublic(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated: boolean) => console.log("Authenticated:", isAuthenticated)),
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.router.navigate(["/heroes/list"]);
          return false;
        }
        return true;
      })
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkIfPublic();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkIfPublic();
  }
} 
