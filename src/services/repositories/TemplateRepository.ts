import { db } from '../db';
import { GeneratorTemplate } from '../../types/database';

export class TemplateRepository {
  static async addTemplate(template: Omit<GeneratorTemplate, 'id'>): Promise<number> {
    return await db.templates.add(template as GeneratorTemplate);
  }

  static async getAllTemplates(): Promise<GeneratorTemplate[]> {
    return await db.templates.orderBy('createdAt').reverse().toArray();
  }

  static async deleteTemplate(id: number): Promise<void> {
    await db.templates.delete(id);
  }

  static async toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
    await db.templates.update(id, { isFavorite });
  }
}
