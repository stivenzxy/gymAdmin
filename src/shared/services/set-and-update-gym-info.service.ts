import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/environments/api-config';
import { GymData } from '../models/entities/gymData';
import {
  CreateGymResponse,
  UpdateGymResponse,
} from '../models/responses/gymInfoResponse';

@Injectable({
  providedIn: 'root',
})
export class SetAndUpdateGymInfoService {
  private requestUrl = `${apiConfig.baseUrl}gyms/`;

  constructor(private http: HttpClient) {}

  createGym(data: GymData): Observable<CreateGymResponse> {
    const gymData = {name: data.name, max_capacity: data.max_capacity}
    return this.http.post<CreateGymResponse>(this.requestUrl, gymData);
  }

  updateGym(gymId: number,data: GymData): Observable<UpdateGymResponse> {
    const gymData = { name: data.name, max_capacity: data.max_capacity };
    return this.http.patch<UpdateGymResponse>(
      `${this.requestUrl}${gymId}/`,
      gymData
    );
  }

  getGyms(): Observable<GymData[]> {
    return this.http.get<GymData[]>(this.requestUrl);
  }

  getGym(gym_id: number | null): Observable<GymData> {
    return this.http.get<GymData>(`${this.requestUrl}${gym_id}/`);
  }
}
