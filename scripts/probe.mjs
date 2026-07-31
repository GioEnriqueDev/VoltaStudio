import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegStatic);

const VIDEO_PATH = path.join(process.cwd(), 'public', 'video.mp4');

ffmpeg.ffprobe(VIDEO_PATH, (err, metadata) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(metadata.format, null, 2));
  console.log(JSON.stringify(metadata.streams, null, 2));
});
