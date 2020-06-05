import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private unreadedNotifications: Number;
  private unreadedMessages: Number;
  constructor() { }
}
