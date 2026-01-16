export interface Participant {
  id: string;
  name: string;
  email: string;
  number: number;
  createdAt: Date;
}

export interface Winner {
  id: string;
  number: number;
  participantId: string;
  participantName: string;
  prize: string;
  drawnAt: Date;
}

export interface AppSettings {
  minNumber: number;
  maxNumber: number;
  eventName: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}
