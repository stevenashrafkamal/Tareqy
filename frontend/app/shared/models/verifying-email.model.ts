export type VerifyingEmailType = 'user' | 'instructor' | 'codeReviewer';

export interface VerifyingEmail {
  _id: string;
  type: VerifyingEmailType;
  OTP: string | null;
  OTPDate: string | null;
}
