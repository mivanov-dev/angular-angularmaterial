// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// custom
import { environment } from '../../../../environments/environment';
import * as fromForgotPassword from '../../../user/forgot-password/store';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordService {

  private forgotPasswordUrl: string = environment.request.apiUserForgotPassword;

  constructor(private http: HttpClient) { }

  forgotPassword$(data: fromForgotPassword.ForgotPasswordStart): Observable<fromForgotPassword.ForgotPassword> {

    return this.http.post<fromForgotPassword.ForgotPassword>(this.forgotPasswordUrl, data);

  }

}
