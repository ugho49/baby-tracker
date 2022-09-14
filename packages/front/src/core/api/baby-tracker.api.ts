import axios, { AxiosInstance, AxiosPromise } from 'axios';
import {
  AddBabyRelation,
  AddOrUpdateTimelineEntry,
  Authentication,
  Baby,
  BabyRelationId,
  BabyTimeline,
  BabyTrackerApi,
  BabyWithRelations,
  BabyWithUserAuthority,
  GetTimelineQuery,
  Login,
  RegisterBaby,
  RegisterUser,
  UpdateBaby,
  UpdateBabyRelation,
  User,
} from '@baby-tracker/common-types';
import { createApiRef } from '@baby-tracker/common-front';
import { environment } from '../../environments/environment';

export const babyTrackerApiRef = createApiRef<BabyTrackerApi>({
  id: 'baby-tracker-api',
});

export class BabyTrackerApiImpl implements BabyTrackerApi {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: environment.baseUrl,
      timeout: 30000, // 30 seconds
    });
  }

  addBabyRelation(babyId: string, data: AddBabyRelation): AxiosPromise<BabyRelationId> {
    return this.instance.post(`/baby/${babyId}/relation`, data);
  }

  addBabyTimeline(babyId: string, data: AddOrUpdateTimelineEntry): AxiosPromise<BabyTimeline> {
    return this.instance.post(`/baby/${babyId}/timeline`, data);
  }

  deleteBaby(babyId: string): AxiosPromise<void> {
    return this.instance.delete(`/baby/${babyId}`);
  }

  deleteBabyRelation(babyId: string, relationId: string): AxiosPromise<void> {
    return this.instance.delete(`/baby/${babyId}/relation/${relationId}`);
  }

  deleteBabyTimeline(babyId: string, timelineId: string): AxiosPromise<void> {
    return this.instance.delete(`/baby/${babyId}/timeline/${timelineId}`);
  }

  getAllMyBabies(): AxiosPromise<BabyWithUserAuthority[]> {
    return this.instance.get(`/baby`);
  }

  getBabyById(babyId: string): AxiosPromise<BabyWithRelations> {
    return this.instance.get(`/baby/${babyId}`);
  }

  getBabyTimeline(babyId: string, params: GetTimelineQuery): AxiosPromise<BabyTimeline[]> {
    return this.instance.get(`/baby/${babyId}/timeline`, { params });
  }

  getUserInfos(): AxiosPromise<User> {
    return this.instance.get(`/user`);
  }

  login(data: Login): AxiosPromise<Authentication> {
    return this.instance.post(`/auth/login`, data);
  }

  register(data: RegisterUser): AxiosPromise<User> {
    return this.instance.post(`/user/register`, data);
  }

  registerNewBaby(data: RegisterBaby): AxiosPromise<Baby> {
    return this.instance.post(`/baby`, data);
  }

  updateBaby(babyId: string, data: UpdateBaby): AxiosPromise<Baby> {
    return this.instance.put(`/baby/${babyId}`, data);
  }

  updateBabyRelation(babyId: string, relationId: string, data: UpdateBabyRelation): AxiosPromise<void> {
    return this.instance.patch(`/baby/${babyId}/relation/${relationId}`, data);
  }

  updateBabyTimeline(babyId: string, timelineId: string, data: AddOrUpdateTimelineEntry): AxiosPromise<BabyTimeline> {
    return this.instance.put(`/baby/${babyId}/timeline/${timelineId}`, data);
  }
}
