export interface Cardio_Workout_Hist {
  name: string | null;
  id?: number | string | null;
  cardioType: string | null;
  date: string | null;
  notes?: string | null;
  userId?: number | string | null;
  distanceMi: string | number;
  calories: string | number;
  duration: string | number;
  elevationFt?: string | number | null;
  avgPowerW?: string | number | null;
  avgHrBpm?: string | number | null;
  cadencePerMin?: string | number | null;
  outdoor: boolean;
}