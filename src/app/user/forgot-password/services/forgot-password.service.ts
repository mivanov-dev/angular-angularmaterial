// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// custom
import { environment } from 'src/environments/environment';
import * as ForgotPasswordModels from '@app/user/forgot-password/store/models';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordService {

  private forgotPasswordUrl: string = environment.request.apiUserForgotPassword;

  constructor(private http: HttpClient) { }

  forgotPassword$ = (data: ForgotPasswordModels.ForgotPasswordStart): Observable<ForgotPasswordModels.ForgotPassword> =>
    this.http.post<ForgotPasswordModels.ForgotPassword>(this.forgotPasswordUrl, data)

}
