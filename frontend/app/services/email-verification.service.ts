import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class EmailVerificationService {
  private readonly endpoint = '/api/email-verification';

  constructor(private api: ApiService) {}

  generateOTP(type: 'user' | 'instructor' | 'codeReviewer', email: string): Observable<any> {
    return this.api.post(`${this.endpoint}/generate`, { type, email });
  }

  verifyOTP(otp: string, type: 'user' | 'instructor' | 'codeReviewer'): Observable<any> {
    return this.api.post(`${this.endpoint}/verify`, { otp, type });
  }

  resendOTP(type: 'user' | 'instructor' | 'codeReviewer', email: string): Observable<any> {
    return this.api.post(`${this.endpoint}/resend`, { type, email });
  }

  verify(otp: string, type: string): Observable<any> {
    return this.api.post(`${this.endpoint}/verify`, { otp, type });
  }

  deleteOTP(type: 'user' | 'instructor' | 'codeReviewer', email: string): Observable<any> {
    return this.api.post(`${this.endpoint}/delete`, { type, email });
  }
}
