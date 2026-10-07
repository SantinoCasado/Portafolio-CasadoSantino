import { TechItem } from './TechItem';

export interface TechCategory {
  categoryName: string[]; // [Español, Inglés]
  icon: string;
  expanded: boolean;
  items: TechItem[];
}