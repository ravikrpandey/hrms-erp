import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private cache: { [key: string]: any } = {}; // Simple in-memory cache

  constructor(private http: HttpClient) {}

  // Example API call to get location suggestions (replace with actual API)
  getLocationSuggestions(query: string): Observable<any> {
    // Check if the query is already cached
    if (this.cache[query]) {
      console.log('Returning cached results');
      return of(this.cache[query]); // Return cached data as an observable
    }

    // If not cached, make the API call
    return this.http.get(`https://api.example.com/location/search?q=${query}`)
      .pipe(
        switchMap((response: any) => {
          // Store the result in the cache
          this.cache[query] = response;
          return of(response);
        })
      );
  }
}
