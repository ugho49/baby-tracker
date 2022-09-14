import { AxiosInstance } from 'axios';
import {
  AddBabyRelation,
  AddOrUpdateTimelineEntry,
  Authentication,
  Baby,
  BabyRelationId,
  BabyTimeline,
  BabyWithRelations,
  BabyWithUserAuthority,
  GetTimelineQuery,
  Login,
  RegisterBaby,
  RegisterUser,
  UpdateBaby,
  UpdateBabyRelation,
  User,
} from './types';

export interface BabyTrackerApi {
  instance: AxiosInstance;
  login: (data: Login) => Promise<Authentication>;
  register: (data: RegisterUser) => Promise<User>;
  getUserInfos: () => Promise<User>;
  getBabyById: (babyId: string) => Promise<BabyWithRelations>;
  getAllMyBabies: () => Promise<BabyWithUserAuthority[]>;
  registerNewBaby: (data: RegisterBaby) => Promise<Baby>;
  updateBaby: (babyId: string, data: UpdateBaby) => Promise<Baby>;
  deleteBaby: (babyId: string) => Promise<void>;
  getBabyTimeline: (babyId: string, params: GetTimelineQuery) => Promise<BabyTimeline[]>;
  addBabyTimeline: (babyId: string, data: AddOrUpdateTimelineEntry) => Promise<BabyTimeline>;
  updateBabyTimeline: (babyId: string, timelineId: string, data: AddOrUpdateTimelineEntry) => Promise<BabyTimeline>;
  deleteBabyTimeline: (babyId: string, timelineId: string) => Promise<void>;
  addBabyRelation: (babyId: string, data: AddBabyRelation) => Promise<BabyRelationId>;
  updateBabyRelation: (babyId: string, relationId: string, data: UpdateBabyRelation) => Promise<void>;
  deleteBabyRelation: (babyId: string, relationId: string) => Promise<void>;
}
