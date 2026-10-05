export interface TechItem {
  id: string;
  name: string;
  icon: string;
  status: string[];       // [Español, Inglés]
  description: string[];  // [Español, Inglés]
  knowledge: number;      // Ahora es un número (ej: 70)
  usagePercentage: number; // Ahora es un número (ej: 70)
}