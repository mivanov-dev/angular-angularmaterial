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

  private resetPasswordUrl: string = environment.request.apiUserResetPassword;

  constructor(private http: HttpClient) { }

  resetPassword$(data: ResetPasswordModels.ResetPasswordStart): Observable<any> {

    return this.http.post<any>(this.resetPasswordUrl, data);

  }

}
