import { db } from '../db';
import { GeneratorHistoryItem } from '../../types/database';

export class GeneratorHistoryRepository {
  static async addHistory(item: Omit<GeneratorHistoryItem, 'id'>): Promise<number> {
    return await db.generatorHistory.add(item as GeneratorHistoryItem);
  }

  static async getAllHistory(): Promise<GeneratorHistoryItem[]> {
    return await db.generatorHistory.orderBy('timestamp').reverse().toArray();
  }

  static async deleteHistory(id: number): Promise<void> {
    await db.generatorHistory.delete(id);
  }

  static async clearAll(): Promise<void> {
    await db.generatorHistory.clear();
  }

  static async toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
    await db.generatorHistory.update(id, { isFavorite });
  }
}
