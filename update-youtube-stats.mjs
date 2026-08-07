import { writeFile } from 'node:fs/promises';

const apiKey = process.env.YOUTUBE_API_KEY;
const handle = '@ShadyGG-13';
const apiBase = 'https://www.googleapis.com/youtube/v3';

if (!apiKey) {
  throw new Error('Missing YOUTUBE_API_KEY repository secret.');
}

async function youtubeRequest(path, params) {
  const url = new URL(`${apiBase}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: { 'User-Agent': 'ShadyGG-GitHub-Stats/2.0' }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API request failed (${response.status}): ${body}`);
  }

  return response.json();
}

const channelData = await youtubeRequest('channels', {
  part: 'snippet,statistics,contentDetails',
  forHandle: handle
});

const channel = channelData.items?.[0];
if (!channel) {
  throw new Error(`No YouTube channel found for ${handle}.`);
}

const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
if (!uploadsPlaylistId) {
  throw new Error('The channel uploads playlist could not be found.');
}

const uploadedItems = [];
let pageToken = '';

do {
  const page = await youtubeRequest('playlistItems', {
    part: 'snippet,contentDetails',
    playlistId: uploadsPlaylistId,
    maxResults: 50,
    pageToken
  });

  uploadedItems.push(...(page.items ?? []));
  pageToken = page.nextPageToken ?? '';
} while (pageToken);

const publicVideos = uploadedItems
  .filter((item) => item.contentDetails?.videoId && item.snippet?.title !== 'Deleted video' && item.snippet?.title !== 'Private video')
  .map((item) => ({
    id: item.contentDetails.videoId,
    title: item.snippet?.title ?? 'Shady GG video',
    description: item.snippet?.description ?? '',
    publishedAt: item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? '',
    thumbnail:
      item.snippet?.thumbnails?.maxres?.url ??
      item.snippet?.thumbnails?.standard?.url ??
      item.snippet?.thumbnails?.high?.url ??
      item.snippet?.thumbnails?.medium?.url ??
      item.snippet?.thumbnails?.default?.url ??
      `https://i.ytimg.com/vi/${item.contentDetails.videoId}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`
  }))
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const totalMissions = publicVideos.length;
const videoList = publicVideos.map((video, index) => ({
  ...video,
  mission: Math.max(1, totalMissions - index)
}));

const statistics = channel.statistics ?? {};
const output = {
  channel: channel.snippet?.title ?? 'Shady GG',
  handle,
  channelId: channel.id,
  subscribers: Number(statistics.subscriberCount ?? 0),
  videos: Number(statistics.videoCount ?? videoList.length),
  views: Number(statistics.viewCount ?? 0),
  hiddenSubscriberCount: Boolean(statistics.hiddenSubscriberCount),
  updatedAt: new Date().toISOString(),
  latestVideo: videoList[0] ?? null,
  videoList
};

await writeFile('channel-stats.json', `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Updated channel statistics and ${videoList.length} public video(s).`);
