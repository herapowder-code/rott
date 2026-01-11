
import { Exercise } from '../types';

export const MASTER_EXERCISES: Exercise[] = [
  // PECHO
  { 
    name: 'Press de Banca con Barra', 
    muscle: 'Pecho', 
    xp: 'STR +15 XP', 
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-performing-bench-press-exercise-in-the-gym-31317-large.mp4'
  },
  { 
    name: 'Press Inclinado Mancuernas', 
    muscle: 'Pecho', 
    xp: 'STR +12 XP', 
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-his-chest-muscles-with-dumbbells-31313-large.mp4'
  },
  { 
    name: 'Aperturas con Mancuernas', 
    muscle: 'Pecho', 
    xp: 'STR +10 XP', 
    img: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=200'
  },
  { 
    name: 'Fondos en Paralelas', 
    muscle: 'Pecho', 
    xp: 'STR +14 XP', 
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a726ec?auto=format&fit=crop&q=80&w=200'
  },
  // ESPALDA
  { 
    name: 'Dominadas Pronas', 
    muscle: 'Espalda', 
    xp: 'STR +18 XP', 
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-pull-ups-at-the-gym-31315-large.mp4'
  },
  { 
    name: 'Remo con Barra', 
    muscle: 'Espalda', 
    xp: 'STR +14 XP', 
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-with-a-barbell-at-the-gym-31323-large.mp4'
  },
  { 
    name: 'Jalón al Pecho', 
    muscle: 'Espalda', 
    xp: 'STR +12 XP', 
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=200'
  },
  { 
    name: 'Remo con Mancuerna', 
    muscle: 'Espalda', 
    xp: 'STR +10 XP', 
    img: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&q=80&w=200'
  },
  // PIERNAS
  { 
    name: 'Sentadilla Libre', 
    muscle: 'Piernas', 
    xp: 'STR +25 XP', 
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-muscular-man-doing-squats-with-a-barbell-31311-large.mp4'
  },
  { 
    name: 'Peso Muerto Rumano', 
    muscle: 'Piernas', 
    xp: 'STR +22 XP', 
    img: 'https://images.unsplash.com/photo-1534367958042-45e0766f68ba?auto=format&fit=crop&q=80&w=200'
  },
  { 
    name: 'Prensa Inclinada', 
    muscle: 'Piernas', 
    xp: 'STR +20 XP', 
    img: 'https://images.unsplash.com/photo-1534367958042-45e0766f68ba?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-on-the-leg-press-machine-at-the-gym-31321-large.mp4'
  },
  { 
    name: 'Zancadas con Mancuernas', 
    muscle: 'Piernas', 
    xp: 'STR +15 XP', 
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a726ec?auto=format&fit=crop&q=80&w=200'
  },
  // HOMBROS
  { 
    name: 'Press Militar', 
    muscle: 'Hombros', 
    xp: 'STR +12 XP', 
    img: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-shoulder-press-at-the-gym-31319-large.mp4'
  },
  { 
    name: 'Elevaciones Laterales', 
    muscle: 'Hombros', 
    xp: 'SPD +5 XP', 
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a726ec?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-muscular-man-doing-shoulder-raises-with-dumbbells-31325-large.mp4'
  },
  { 
    name: 'Face Pulls', 
    muscle: 'Hombros', 
    xp: 'SPD +6 XP', 
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=200'
  },
  // BRAZOS
  { 
    name: 'Curl de Bíceps', 
    muscle: 'Brazos', 
    xp: 'STR +8 XP', 
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-bicep-curls-with-dumbbells-31327-large.mp4'
  },
  { 
    name: 'Curl Martillo', 
    muscle: 'Brazos', 
    xp: 'STR +7 XP', 
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
  },
  { 
    name: 'Extensiones de Tríceps', 
    muscle: 'Brazos', 
    xp: 'STR +8 XP', 
    img: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-triceps-with-a-rope-machine-31329-large.mp4'
  },
  { 
    name: 'Press Francés', 
    muscle: 'Brazos', 
    xp: 'STR +9 XP', 
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef03a726ec?auto=format&fit=crop&q=80&w=200'
  }
];
