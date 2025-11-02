import { Injectable } from "@angular/core";
import { UserService } from "@app/user.service";
import { AuthenticationResponse, userType } from "../authentication.const";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { baseUrl } from "src/common/base";
import { User } from "src/common/common.types";
import { Observable, map, catchError, of } from "rxjs";

type data = {
    username: string,
    password: string,
    role: userType
}


@Injectable({
    providedIn: 'root',
})

export class AuthenticationService {

    constructor(private userService: UserService, private http: HttpClient) {}

    authenticate(username: string, password: string): Observable<boolean> {
        return this.http.post<AuthenticationResponse>(
            `${baseUrl}/login`,
            { email: username, password },
            { observe: 'response' }
        ).pipe(
            map((response: HttpResponse<AuthenticationResponse>) => {
            if (response.status === 200 && response.body?.role) {
                this.userService.setUserType(response.body.role);
                const user: User = {
                email: username,
                role: response.body.role,
                id: response.body?.id
                };
                this.userService.setUser(user);

                return true;
            }
            return false;
            }),
            catchError(() => of(false))
        );
    }   
}