// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// custom
import { environment } from '../../../../environments/environment';
import * as fromResetPassword from '../store';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {

    private resetPasswordUrl: string = environment.request.apiUserResetPassword;

    constructor(private http: HttpClient) { }

    resetPassword$(data: fromResetPassword.ResetPasswordStart): Observable<any> {

        return this.http.post<any>(this.resetPasswordUrl, data);

    }

}
