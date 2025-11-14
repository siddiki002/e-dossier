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
        if(!!this._userType.value){
            return this._userType.asObservable();
        } else {
            // return value saved in local storage
            const userType = JSON.parse(localStorage.getItem('userType') || 'null');
            this._userType.next(userType);
            return this._userType.asObservable();
        }
    }
    
    setUserType(user: userType) {
        this._userType.next(user);
        // save value in local storage
        localStorage.setItem('userType', JSON.stringify(user));
    }

    get User() {
        if(!!this._user.value){
            return this._user.asObservable();
        } else {
            const user = JSON.parse(localStorage.getItem('user') || 'null') as User | null;
            this._user.next(user);
            return this._user.asObservable();
        }
    }

    setUser(user: User | null) {
        this._user.next(user);
        // save value in local storage
        localStorage.setItem('user', JSON.stringify(user));
    }

    get isAuthenticated() {
        if(!!this._isAuthenticated.value){
            return this._isAuthenticated.asObservable();
        } else {
            if(this.User) {
                this._isAuthenticated.next(true);
            }
        }
        return this._isAuthenticated.asObservable();
    }

    setIsAuthenticated(isAuthenticated: boolean) {
        this._isAuthenticated.next(isAuthenticated);
    }
}