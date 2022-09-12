import axios, { AxiosInstance } from 'axios';
import { BabyTrackerApi } from '@baby-tracker/common-types';
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
  //
  // login(data: LoginRequest): AxiosPromise<LoginResponse> {
  //   return this.instance.post('/auth/login', data);
  // }
  //
  // register(data: RegisterRequest): AxiosPromise<CreatedOutput> {
  //   return this.instance.post('/auth/register', data);
  // }
  //
  // sendResetUserPasswordEmail(data: ResetPasswordInput): AxiosPromise {
  //   return this.instance.post('/users/forgot-password/send-reset-email', data);
  // }
  //
  // validateResetPassword(data: ResetPasswordValidationInput): AxiosPromise {
  //   return this.instance.put('/users/forgot-password/reset', data);
  // }
  //
  // getMyEvents(page: number = 0): AxiosPromise<PagedOutput<MyEventResponse>> {
  //   return this.instance.get('/events', { params: { p: page } });
  // }
  //
  // getEvent(eventId: string): AxiosPromise<EventOutput> {
  //   return this.instance.get(`/events/${eventId}`);
  // }
  //
  // updateEvent(eventId: string, data: UpdateEventInput): AxiosPromise {
  //   return this.instance.put(`/events/${eventId}`, data);
  // }
  //
  // deleteEvent(eventId: string): AxiosPromise {
  //   return this.instance.delete(`/events/${eventId}`);
  // }
  //
  // createEvent(data: CreateEventInput): AxiosPromise<CreatedOutput> {
  //   return this.instance.post('/events', data);
  // }
  //
  // addAttendeeToEvent(eventId: string, data: AddAttendeeInput): AxiosPromise<Attendee> {
  //   return this.instance.post(`/events/${eventId}/attendee`, data);
  // }
  //
  // deleteAttendeeOfEvent(eventId: string, data: DeleteAttendeeInput): AxiosPromise {
  //   return this.instance.delete(`/events/${eventId}/attendee`, { data: data });
  // }
  //
  // getAllEvents(page: number = 0): AxiosPromise<PagedOutput<AdminEventResponse>> {
  //   return this.instance.get('/admin/events', { params: { p: page } });
  // }
  //
  // getAdminEventById(eventId: string): AxiosPromise<EventOutput> {
  //   return this.instance.get(`/admin/events/${eventId}`);
  // }
  //
  // checkItem(itemId: string): AxiosPromise {
  //   return this.instance.put(`/items/${itemId}/check`);
  // }
  //
  // uncheckItem(itemId: string): AxiosPromise {
  //   return this.instance.put(`/items/${itemId}/uncheck`);
  // }
  //
  // updateItem(itemId: string, data: ItemInput): AxiosPromise {
  //   return this.instance.put(`/items/${itemId}`, data);
  // }
  //
  // deleteItem(itemId: string): AxiosPromise {
  //   return this.instance.delete(`/items/${itemId}`);
  // }
  //
  // getUserInfo(): AxiosPromise<UserOutput> {
  //   return this.instance.get('/users');
  // }
  //
  // searchUserByKeyword(keyword: string): AxiosPromise<MiniUser[]> {
  //   return this.instance.get('/users/search', { params: { keyword } });
  // }
  //
  // updateUser(data: UpdateUserInput): AxiosPromise {
  //   return this.instance.put('/users', data);
  // }
  //
  // changeUserPassword(data: ChangePasswordInput): AxiosPromise {
  //   return this.instance.put('/users/change-password', data);
  // }
  //
  // getUserEmailSettings(): AxiosPromise<UserEmailSettingsOutput> {
  //   return this.instance.get('/users/email-settings');
  // }
  //
  // updateUserEmailSettings(data: UserEmailSettingsInput): AxiosPromise<UserEmailSettingsOutput> {
  //   return this.instance.put('/users/email-settings', data);
  // }
  //
  // getAllUsers(page: number = 0, q?: string): AxiosPromise<PagedOutput<DetailledUserOutput>> {
  //   return this.instance.get('/admin/users', { params: { p: page, q } });
  // }
  //
  // getUserById(userId: string): AxiosPromise<DetailledUserOutput> {
  //   return this.instance.get(`/admin/users/${userId}`);
  // }
  //
  // deleteUser(userId: string): AxiosPromise {
  //   return this.instance.delete(`/admin/users/${userId}`);
  // }
  //
  // updateAllUserDetails(userId: string, data: UpdateFullUserProfileInput): AxiosPromise {
  //   return this.instance.patch(`/admin/users/${userId}`, data);
  // }
  //
  // getMyWishlists(page: number = 0): AxiosPromise<PagedOutput<MyWishlistResponse>> {
  //   return this.instance.get('/wishlists', { params: { p: page } });
  // }
  //
  // getWishlist(wishlistId: string): AxiosPromise<DetailledWishlistOutput> {
  //   return this.instance.get(`/wishlists/${wishlistId}`);
  // }
  //
  // updateWishlist(wishlistId: string, data: UpdateWishlistInput): AxiosPromise {
  //   return this.instance.put(`/wishlists/${wishlistId}`, data);
  // }
  //
  // deleteWishlist(wishlistId: string): AxiosPromise {
  //   return this.instance.delete(`/wishlists/${wishlistId}`);
  // }
  //
  // createWishlist(data: CreateWishlistInput): AxiosPromise<CreatedOutput> {
  //   return this.instance.post('/wishlists', data);
  // }
  //
  // addWishlistToEvent(wishlistId: string, eventId: string): AxiosPromise {
  //   return this.instance.put(`/wishlists/${wishlistId}/event/${eventId}`);
  // }
  //
  // deleteWishlistToEvent(wishlistId: string, eventId: string): AxiosPromise {
  //   return this.instance.delete(`/wishlists/${wishlistId}/event/${eventId}`);
  // }
  //
  // addItemsToWishlist(wishlistId: string, data: ItemsInput): AxiosPromise<Item[]> {
  //   return this.instance.post(`/wishlists/${wishlistId}/items`, data);
  // }
  //
  // getWishlistsEvents(): AxiosPromise<MiniEvent[]> {
  //   return this.instance.get('/wishlists/events');
  // }
}
