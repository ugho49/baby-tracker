import axios, { AxiosInstance } from 'axios';
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

  addBabyRelation(babyId: string, data: AddBabyRelation): Promise<BabyRelationId> {
    return this.instance.post(`/baby/${babyId}/relation`, data);
  }

  addBabyTimeline(babyId: string, data: AddOrUpdateTimelineEntry): Promise<BabyTimeline> {
    return this.instance.post(`/baby/${babyId}/timeline`, data);
  }

  deleteBaby(babyId: string): Promise<void> {
    return this.instance.delete(`/baby/${babyId}`);
  }

  deleteBabyRelation(babyId: string, relationId: string): Promise<void> {
    return this.instance.delete(`/baby/${babyId}/relation/${relationId}`);
  }

  deleteBabyTimeline(babyId: string, timelineId: string): Promise<void> {
    return this.instance.delete(`/baby/${babyId}/timeline/${timelineId}`);
  }

  getAllMyBabies(): Promise<BabyWithUserAuthority[]> {
    return this.instance.get(`/baby`);
  }

  getBabyById(babyId: string): Promise<BabyWithRelations> {
    return this.instance.get(`/baby/${babyId}`);
  }

  getBabyTimeline(babyId: string, params: GetTimelineQuery): Promise<BabyTimeline[]> {
    return this.instance.get(`/baby/${babyId}/timeline`, { params });
  }

  getUserInfos(): Promise<User> {
    return this.instance.get(`/user`);
  }

  login(data: Login): Promise<Authentication> {
    return this.instance.post(`/auth/login`, data);
  }

  register(data: RegisterUser): Promise<User> {
    return this.instance.post(`/user/register`, data);
  }

  registerNewBaby(data: RegisterBaby): Promise<Baby> {
    return this.instance.post(`/baby`, data);
  }

  updateBaby(babyId: string, data: UpdateBaby): Promise<Baby> {
    return this.instance.put(`/baby/${babyId}`, data);
  }

  updateBabyRelation(babyId: string, relationId: string, data: UpdateBabyRelation): Promise<void> {
    return this.instance.patch(`/baby/${babyId}/relation/${relationId}`, data);
  }

  updateBabyTimeline(babyId: string, timelineId: string, data: AddOrUpdateTimelineEntry): Promise<BabyTimeline> {
    return this.instance.put(`/baby/${babyId}/timeline/${timelineId}`, data);
  }
}
