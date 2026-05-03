import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ShipType = 'rowboat' | 'sloop' | 'galleon';

@Injectable({
  providedIn: 'root'
})
export class ShipService {
  private currentShipSubject = new BehaviorSubject<ShipType>('rowboat');
  public currentShip$ = this.currentShipSubject.asObservable();

  constructor() {}

  setShipBasedOnLevel(levelIndex: number): void {
    if (levelIndex <= 1) {
      this.currentShipSubject.next('rowboat');
    } else if (levelIndex <= 3) {
      this.currentShipSubject.next('sloop');
    } else {
      this.currentShipSubject.next('galleon');
    }
  }

  getShipIconPath(type: ShipType): string {
    switch (type) {
      case 'rowboat': return 'assets/icons/rowboat.svg';
      case 'sloop': return 'assets/icons/sloop.svg';
      case 'galleon': return 'assets/icons/galleon.svg';
      default: return 'assets/icons/rowboat.svg';
    }
  }
}
