import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  apiConsultaCNEL: any = environment.apiConsultaCNEL;

  private urls: any = {
    IDENTIFICACION: this.apiConsultaCNEL+'{input}/IDENTIFICACION',
    CUENTA_CONTRATO: this.apiConsultaCNEL+'{input}/CUENTA_CONTRATO',
    CUEN: this.apiConsultaCNEL+'{input}/CUEN'
  };

  constructor(private http: HttpClient) { }

  consultarNotificaciones(tipo: string, input: string): Observable<any> {
    const url = this.urls[tipo].replace('{input}', input);
    return this.http.get<any>(url);
  }
}
