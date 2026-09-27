import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';

const baseServerUrl = environment.serverUrl; 

const route = {
  contract:'/api/v1/contracts',
  contract_type:'/api/v1/contract-type'
}
@Injectable({
  providedIn: 'root'
})
export class ContractService {
   private fieldTypeSub$ = new BehaviorSubject<null | any[]>(null); // Stores data
   private contractTypeSub$ = new BehaviorSubject<null | any[]>(null); // Stores data
 
  constructor(private http: HttpClient) { };
// contract type 
  getContractType(params?:any){
    return this.http.get(`${baseServerUrl}${route.contract_type}`, {params:params})
  }
  addContractType(body:{name:string}){
    return this.http.post(`${baseServerUrl}${route.contract_type}`, body)
  }
  updateContractType(id: string, body:{name:string}){
    return this.http.put(`${baseServerUrl}${route.contract_type}/${id}`, body)
  }
  deleteContractType(id: string){
    return this.http.delete(`${baseServerUrl}${route.contract_type}/${id}`)
  }

  // ******* contracts ***********
  getContracts(params?:any){
    return this.http.get(`${baseServerUrl}${route.contract}`, {params:params})
  }
  createContracts(body: any):Observable<any>{
    return this.http.post(`${baseServerUrl}${route.contract}`, body)
  }

  /*cotract audit/tickets */
  contractTickets(params?:any){
    return this.http.get(`${baseServerUrl}${route.tickets}`, {params:params})
  }
  deleteTicket(id: string){
    return this.http.delete(`${baseServerUrl}${route.tickets}/${id}`)
  }

   // storageApis/ observables
   contractTypeStoredData(): Observable<any[]> {
    return this.contractTypeSub$.pipe(
      switchMap((data:any) => {
        if (data === null) {
          // Fetch data from the API if not already cached
          return this.getContractType().pipe(
            tap((res:any) => this.contractTypeSub$.next(res?.data)), // Cache the result
            take(1) // Automatically complete the HTTP request observable
          );
        }
        // Return the cached data as an observable
        console.log(data, "ctypeStatic <<<<>>>")
        // if(data[0].id == -1){
        //   data = data.shift()
        // }
        debugger
        return of(data);
      })
    );
  }
  resetStaticContractTypeData(){
    this.contractTypeSub$.next(null)
  }
  
  fieldTypeStoredData(): Observable<any[]> {
    return this.fieldTypeSub$.pipe(
      switchMap((data) => {
        if (data === null) {
          // Fetch data from the API if not already cached
          return this.http.get<any>(`${baseServerUrl}/api/v1/getFieldType`).pipe(
            tap((res:any) => this.fieldTypeSub$.next(res?.data)), // Cache the result
            take(1) // Automatically complete the HTTP request observable
          );
        }
        // Return the cached data as an observable
        return of(data);
      })
    );
  }
}
