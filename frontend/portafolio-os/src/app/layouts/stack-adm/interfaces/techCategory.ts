import { TechItem } from './TechItem';

export interface TechCategory {
  categoryName: string[]; // [Español, Inglés]
  expanded: boolean;
  items: TechItem[];
}