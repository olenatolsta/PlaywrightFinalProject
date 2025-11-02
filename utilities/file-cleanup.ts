import * as fs from 'fs';

export function deleteFileIfExists(filePath?: string): void {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
