
export interface Exercise {
  name: string;
  muscle: string;
  xp: string;
  img: string;
  videoUrl?: string;
}

export interface PlannedExercise extends Exercise {
  sets: number;
  rir: string;
  tempo: string;
}

export interface DailyRoutine {
  dayName: string;
  exercises: PlannedExercise[];
}

export interface WeeklyPlan {
  days: DailyRoutine[];
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: 'Desarrollo de Masa Muscular' | 'Potencia y Fuerza Máxima' | 'Definición y Composición Corporal' | 'Acondicionamiento Cardiovascular' | 'Déficit Calórico (Pérdida de Grasa)';
  trainingDays: number;
  injuries: string;
  pathologies: string;
  photo?: string;
  availability: string;
}

export interface Meal {
  time: string;
  name: string;
  quantity: string;
  description: string;
  kcal: number;
}

export interface DailyDiet {
  dayName: string;
  meals: Meal[];
}

export interface WeeklyDiet {
  planName: string;
  dailyKcal: number;
  days: DailyDiet[];
}

export interface TrainingSession {
  id: string;
  date: string;
  durationMinutes: number;
  routineName: string;
  exerciseCount: number;
}

export interface MedicalRecord {
  id: string;
  date: string;
  summary: string;
  type: 'BloodTest' | 'Report';
}

export interface ProgressPhoto {
  date: string;
  url: string;
  analysis: string;
}

export interface Stat {
  icon: string;
  label: string;
  lvl: string;
  pc: string;
  extra?: string;
}

export interface SeriesLog {
  weight: number;
  reps: number;
  timestamp: number;
}
