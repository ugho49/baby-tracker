import { AxiosInstance, AxiosPromise } from 'axios';
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
  login: (data: Login) => AxiosPromise<Authentication>;
  register: (data: RegisterUser) => AxiosPromise<User>;
  getUserInfos: () => AxiosPromise<User>;
  getBabyById: (babyId: string) => AxiosPromise<BabyWithRelations>;
  getAllMyBabies: () => AxiosPromise<BabyWithUserAuthority[]>;
  registerNewBaby: (data: RegisterBaby) => AxiosPromise<Baby>;
  updateBaby: (babyId: string, data: UpdateBaby) => AxiosPromise<Baby>;
  deleteBaby: (babyId: string) => AxiosPromise<void>;
  getBabyTimeline: (babyId: string, params: GetTimelineQuery) => AxiosPromise<BabyTimeline[]>;
  addBabyTimeline: (babyId: string, data: AddOrUpdateTimelineEntry) => AxiosPromise<BabyTimeline>;
  updateBabyTimeline: (
    babyId: string,
    timelineId: string,
    data: AddOrUpdateTimelineEntry
  ) => AxiosPromise<BabyTimeline>;
  deleteBabyTimeline: (babyId: string, timelineId: string) => AxiosPromise<void>;
  addBabyRelation: (babyId: string, data: AddBabyRelation) => AxiosPromise<BabyRelationId>;
  updateBabyRelation: (babyId: string, relationId: string, data: UpdateBabyRelation) => AxiosPromise<void>;
  deleteBabyRelation: (babyId: string, relationId: string) => AxiosPromise<void>;
}
