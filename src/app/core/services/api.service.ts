import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Base URL for all requests, read from the environment config.
  // Feature services extend this class and resolve their own endpoints via buildUrl().
  protected readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  // Combines the base URL with a service-specific path to form a full request URL.
  // Kept as the single place where URL composition happens so the API host
  // only ever needs to be changed in the environment file.
  protected buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
