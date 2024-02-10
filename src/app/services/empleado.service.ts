import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  myAppUrl = 'https://localhost:44384/api/'
  constructor(private http: HttpClient) { }

  getListEmpleados(): Observable<any>{
    return this.http.get(this.myAppUrl+'Empleado')
  }

  getListCargos(): Observable<any>{
    return this.http.get(this.myAppUrl+'Cargo')
  }

  deleteEmpleado(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl+'Empleado/'+id)
  }

  saveEmpleado(empleado: any): Observable<any>{
    // Configurar el encabezado Content-Type
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('https://localhost:44384/api/Empleado',empleado,httpOptions)
  }

  updateEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put(this.myAppUrl+'Empleado/'+id, empleado);
  }
}
