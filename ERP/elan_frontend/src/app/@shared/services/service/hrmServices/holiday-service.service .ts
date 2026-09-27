import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from 'date-fns/locale';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class holidayServiceService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  create_holiday(body: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/create_holiday`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  get_All_holiday(entity_id: any, financial_id: string) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/get_All_holiday?entity_id=${entity_id}&financial_id=${financial_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getAll_Region(entity_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Region`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_Municipality(entity_id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/get_Municipality/${entity_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  get_ById_holiday(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/get_ById_holiday/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  delete_holiday(id: any) {
    return this.http
      .delete<any>(`${this.databaseKey}/api/v1/delete_holiday/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  edit_holiday(id: any, body: any) {
    return this.http
      .put<any>(`${this.databaseKey}/api/v1/edit_holiday/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  updateHolidayStatus(id: any, status: any) {
    return this.http
      .put<any>(
        `${this.databaseKey}/api/v1/updateHolidayStatus/${id}/${status}`,
        {}
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  // Create a holiday category
  createHolidayCategory(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/holidayCategory`, body);
  }

  // Get all holiday categories
  getAllHolidayCategories() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/holidayCategory`);
  }

  // Get a single holiday category by ID
  getHolidayCategoryById(id: number | string) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/holidayCategory/${id}`);
  }

  // Update a holiday category by ID
  updateHolidayCategory(id: number | string, body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/holidayCategory/${id}`, body);
  }

  // Delete a holiday category by ID
  deleteHolidayCategory(id: number | string) {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/holidayCategory/${id}`);
  }
}
