export type Meeting = {
  duration: number;
  is_ended: boolean;
  is_live: boolean;
  is_upcoming: boolean;
  join_url: string;
  replay_url: string;
  password: string;
  provider: string;
  start_at: string;
  is_recurring: boolean;
  occurrence: {
    current: number;
    duration: number;
    occurrence_id: string;
    start_time: string;
    status: string;
    total: number;
  } | null;
  timezone: string;
  type: string;
};
