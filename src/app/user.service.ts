import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { userType } from "./authentication/authentication.const";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user : BehaviorSubject<userType> = new BehaviorSubject<userType>(null);
    private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get user() {
        return this._user.asObservable();
    }
    
    setUser(user: userType) {
        this._user.next(user);
    }

    get isAuthenticated() {
        return this._isAuthenticated.asObservable();
    }

    setIsAuthenticated(isAuthenticated: boolean) {
        this._isAuthenticated.next(isAuthenticated);
    }
}