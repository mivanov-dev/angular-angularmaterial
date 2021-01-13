// angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// rxjs
import { Observable } from 'rxjs';
// custom
import * as QrModels from '../store/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QrService {

    private qrSetupUrl: string = environment.request.apiUserQrSetup;
    private qrVerifyUrl: string = environment.request.apiUserQrVerify;

    constructor(private http: HttpClient) { }

    setup$(data: QrModels.SetupStart): Observable<QrModels.Setup> {
        
        const { enable } = data;
        const params = new HttpParams().set('enable', `${enable}`);
        return this.http.get<QrModels.Setup>(this.qrSetupUrl, { params });

    }

    verify$(data: QrModels.VerifyStart): Observable<QrModels.Verify> {

        return this.http.post<QrModels.Verify>(this.qrVerifyUrl, data);

    }

}
