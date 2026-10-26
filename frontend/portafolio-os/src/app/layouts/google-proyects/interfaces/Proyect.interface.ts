export interface ProjectInterface {
  id: string;
  title: {
    es: string;
    en: string;
  }
  description: {
    es: string;
    en: string;
  };
  technologies: string[]; // Ej: ['Angular', 'TypeScript', 'Node.js']
  type: 'Web' | 'Desktop' | 'Backend' | 'Mobile' | 'Data Analytics' | 'Other'; // Tipo de proyecto
  repoUrl: string;
  liveUrl?: string; // Opcional, si está deployado
}