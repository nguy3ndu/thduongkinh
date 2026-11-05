import { Game } from '../types/game';
import { DEFAULT_GAMES } from '../data/defaultGames';

const STORAGE_KEY = 'hoanghia_edgames_library_v1';

export const storage = {
  // Get all games from localStorage or initialize with defaults
  getGames(): Game[] {
    if (typeof window === 'undefined') return DEFAULT_GAMES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GAMES));
        return DEFAULT_GAMES;
      }
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_GAMES;
    } catch (err) {
      console.error('Error loading games from storage:', err);
      return DEFAULT_GAMES;
    }
  },

  // Save games array
  saveGames(games: Game[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (err) {
      console.error('Error saving games to storage:', err);
    }
  },

  // Save or update a single game
  saveGame(game: Game): Game[] {
    const games = this.getGames();
    const existingIndex = games.findIndex((g) => g.id === game.id);
    const now = new Date().toISOString().split('T')[0];

    const updatedGame = {
      ...game,
      updatedAt: now,
      isCustom: true,
    };

    let updatedList: Game[];
    if (existingIndex >= 0) {
      updatedList = [...games];
      updatedList[existingIndex] = updatedGame;
    } else {
      updatedList = [updatedGame, ...games];
    }

    this.saveGames(updatedList);
    return updatedList;
  },

  // Delete a game
  deleteGame(id: string): Game[] {
    const games = this.getGames();
    const updated = games.filter((g) => g.id !== id);
    this.saveGames(updated);
    return updated;
  },

  // Reset to default sample games
  resetToDefaults(): Game[] {
    if (typeof window === 'undefined') return DEFAULT_GAMES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GAMES));
    return DEFAULT_GAMES;
  },

  // Export database as JSON file for download
  exportDatabase(): void {
    const games = this.getGames();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hoanghia_edgames_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import games from parsed JSON object or array
  importDatabase(jsonData: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'Tệp JSON không hợp lệ: Dữ liệu phải là một danh sách trò chơi.' };
      }

      // Basic validation
      const validGames: Game[] = parsed.filter((g) => g && typeof g.id === 'string' && typeof g.title === 'string');
      if (validGames.length === 0) {
        return { success: false, count: 0, error: 'Không tìm thấy trò chơi hợp lệ trong tệp.' };
      }

      this.saveGames(validGames);
      return { success: true, count: validGames.length };
    } catch (err) {
      return { success: false, count: 0, error: 'Lỗi đọc tệp JSON: ' + (err instanceof Error ? err.message : String(err)) };
    }
  },

  // Utility to read and compress image file to Base64 (max width 1280 for fast storage)
  compressAndConvertImage(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Không thể tải tệp hình ảnh'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Lỗi đọc tệp từ thiết bị'));
      reader.readAsDataURL(file);
    });
  },
};
