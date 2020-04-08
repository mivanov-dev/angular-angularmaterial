// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// custom
import { environment } from 'src/environments/environment';
import * as ResetPasswordModels from '../store/models';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {

    private _resetPasswordUrl: string = environment.request.apiUserResetPassword;

    constructor(private _http: HttpClient) { }

    resetPassword$ = (data: ResetPasswordModels.ResetPasswordStart): Observable<any> =>
        this._http.post<any>(this._resetPasswordUrl, data);

}