import sharp from 'sharp';
import { copyFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\55ae19ee-a129-4dff-b372-8e4fe0e1a474';
const publicDir = path.join(__dirname, '..', 'public');

mkdirSync(path.join(publicDir, 'icons'), { recursive: true });
mkdirSync(path.join(publicDir, 'screenshots'), { recursive: true });

// Resize icons
await sharp(path.join(artifactDir, 'symptomcheck_icon_1790067793727.png'))
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, 'icons', 'icon-192.png'));
console.log('✅ icon-192.png created');

await sharp(path.join(artifactDir, 'symptomcheck_icon_1790067793727.png'))
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'icons', 'icon-512.png'));
console.log('✅ icon-512.png created');

// Resize screenshots to 1280x720
await sharp(path.join(artifactDir, 'screenshot_home_1790068180812.png'))
  .resize(1280, 720, { fit: 'cover' })
  .png()
  .toFile(path.join(publicDir, 'screenshots', 'home.png'));
console.log('✅ screenshots/home.png created');

await sharp(path.join(artifactDir, 'screenshot_assessment_1790068251190.png'))
  .resize(1280, 720, { fit: 'cover' })
  .png()
  .toFile(path.join(publicDir, 'screenshots', 'assessment.png'));
console.log('✅ screenshots/assessment.png created');

console.log('\n🎉 All PWA assets generated!');
