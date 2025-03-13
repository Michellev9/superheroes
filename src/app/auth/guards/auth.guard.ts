import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    
    private checkAuthStatus(): boolean | Observable<boolean>{
        return this.authService.checkAuthentication().pipe(
            tap((isAuthenticated: boolean) => console.log('Authenticated:', isAuthenticated)),
            tap((isAuthenticated: boolean) => {
                if(!isAuthenticated){
                    this.router.navigate(['./auth/login']);
                }
            })
        );
    }

    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        return this.checkAuthStatus();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean>{
        return this.checkAuthStatus();
    }
    
}