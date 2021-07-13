interface IEvent {
  startDate?: Date;
  eventType?:
    | 'Running'
    | 'Biking'
    | 'Soccer'
    | 'Basketball'
    | 'Rugby'
    | 'Hiking'
    | 'Tennis';
  participants?: string[];
  limitParticipants?: number;
  pace?: string;
  openEvent?: boolean;
  rejectedParticipants?: string[];
  pendingApprovalParticipants?: string[];
  created_at?: Date;
  location?: { type: string; coordinates: number[] };
}

export default IEvent;
