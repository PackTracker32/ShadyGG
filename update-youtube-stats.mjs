import { writeFile } from 'node:fs/promises';

const apiKey = process.env.YOUTUBE_API_KEY;
const handle = '@ShadyGG-13';

if (!apiKey) {
  throw new Error('Missing YOUTUBE_API_KEY repository secret.');
}

const url = new URL('https://www.googleapis.com/youtube/v3/channels');
url.searchParams.set('part', 'snippet,statistics');
url.searchParams.set('forHandle', handle);
url.searchParams.set('key', apiKey);

const response = await fetch(url, {
  headers: { 'User-Agent': 'ShadyGG-GitHub-Stats/1.0' }
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`YouTube API request failed (${response.status}): ${body}`);
}

const data = await response.json();
const channel = data.items?.[0];
if (!channel) {
  throw new Error(`No YouTube channel found for ${handle}.`);
}

const statistics = channel.statistics ?? {};
const output = {
  channel: channel.snippet?.title ?? 'Shady GG',
  handle,
  channelId: channel.id,
  subscribers: Number(statistics.subscriberCount ?? 0),
  videos: Number(statistics.videoCount ?? 0),
  views: Number(statistics.viewCount ?? 0),
  hiddenSubscriberCount: Boolean(statistics.hiddenSubscriberCount),
  updatedAt: new Date().toISOString()
};

await writeFile('channel-stats.json', `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log('Updated channel statistics:', output);
