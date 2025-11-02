import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { userType } from "./authentication/authentication.const";
import { User } from "src/common/common.types";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _userType : BehaviorSubject<userType> = new BehaviorSubject<userType>(null);
    private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get userType() {
        return this._userType.asObservable();
    }
    
    setUserType(user: userType) {
        this._userType.next(user);
    }

    get User() {
        return this._user.asObservable();
    }

    setUser(user: User | null) {
        this._user.next(user);
    }

    get isAuthenticated() {
        return this._isAuthenticated.asObservable();
    }

    setIsAuthenticated(isAuthenticated: boolean) {
        this._isAuthenticated.next(isAuthenticated);
    }
}