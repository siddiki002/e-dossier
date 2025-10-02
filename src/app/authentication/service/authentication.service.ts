import { Injectable } from "@angular/core";
import { UserService } from "@app/user.service";
import { userType } from "../authentication.const";

type data = {
    username: string,
    password: string,
    role: userType
}


@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    private _dummyData : data[] = [];

    constructor(private userService: UserService) {
        this.loadData();
    }

    private async loadData() {
        const dummyData = await import('../../../static/credentials.json')
        this._dummyData = JSON.parse(JSON.stringify(dummyData)).default;
    }

    authenticate(username: string, password: string): boolean {
        // TODO: The authentication will be done from a backend server. Currently doing it on dummy data.
        const user = this._dummyData.find(user => user.username === username && user.password === password);
        if(user) {
            this.userService.setUser(user.role)
            return true;
        }
        return false;
    }
}