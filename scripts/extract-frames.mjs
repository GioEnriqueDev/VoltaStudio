import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

const VIDEO_PATH = path.join(process.cwd(), 'public', 'video.mp4');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'frames_hq');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
  // Clear old frames if any
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    fs.unlinkSync(path.join(OUTPUT_DIR, file));
  }
}

console.log('Using ffmpeg binary:', ffmpegStatic);
ffmpeg.setFfmpegPath(ffmpegStatic);

console.log('Extracting frames as JPG...');

ffmpeg(VIDEO_PATH)
  .outputOptions([
    '-vf scale=1920:-1', 
    '-r 30',             
    '-q:v 2', // Massima qualità (1-31, più basso è meglio)
  ])
  .output(path.join(OUTPUT_DIR, 'frame_%04d.jpg'))
  .on('progress', (progress) => {
    process.stdout.write(`Extracted ${progress.frames} frames...\r`);
  })
  .on('end', () => {
    console.log('\n\nExtraction complete! Frames saved to public/frames/');
    process.exit(0);
  })
  .on('error', (err) => {
    console.error('\nError extracting frames:', err);
    process.exit(1);
  })
  .run();
