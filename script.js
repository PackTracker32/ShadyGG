(function () {
  'use strict';

  function initNavigation() {
    var menu = document.querySelector('.menu');
    var nav = document.querySelector('.nav-links');
    if (!menu || !nav) return;

    function setMenu(open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      var icon = menu.querySelector('span');
      if (icon) icon.textContent = open ? '✕' : '☰';
    }

    menu.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!nav.classList.contains('open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target && event.target.tagName === 'A') setMenu(false);
    });

    document.addEventListener('click', function (event) {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 850) setMenu(false);
    });
  }

  function formatMission(number) {
    return String(Math.max(1, Number(number) || 1)).padStart(3, '0');
  }

  function formatDate(value) {
    var date = value ? new Date(value) : null;
    if (!date || isNaN(date.getTime())) return 'New mission';
    return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function setText(selector, value) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
  }

  function updateChannelStats(stats) {
    var subscribers = Number(stats.subscribers) || 0;
    var videos = Number(stats.videos) || 0;
    var views = Number(stats.views) || 0;

    setText('[data-subscriber-count]', subscribers.toLocaleString());
    setText('[data-video-count]', videos.toLocaleString());
    setText('[data-view-count]', views.toLocaleString());

    var updatedDate = stats.updatedAt ? new Date(stats.updatedAt) : null;
    var updatedText = updatedDate && !isNaN(updatedDate.getTime())
      ? updatedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
      : 'Waiting for first update';
    setText('[data-stats-updated]', updatedText);

    var goals = document.querySelectorAll('[data-goal]');
    for (var g = 0; g < goals.length; g++) {
      var goal = Number(goals[g].getAttribute('data-goal')) || 1;
      var percent = Math.min(100, Math.max(0, (subscribers / goal) * 100));
      var bar = goals[g].querySelector('.progress span');
      var value = goals[g].querySelector('[data-progress-value]');
      if (bar) bar.style.width = percent + '%';
      if (value) value.textContent = subscribers.toLocaleString() + ' / ' + goal.toLocaleString();
      goals[g].classList.toggle('complete', subscribers >= goal);
    }
  }

  function updateLatestVideo(video) {
    if (!video) return;
    setText('[data-latest-title]', video.title || 'Latest Shady GG mission');
    setText('[data-latest-date]', formatDate(video.publishedAt));
    setText('[data-latest-mission]', formatMission(video.mission));

    var thumbnails = document.querySelectorAll('[data-latest-thumbnail]');
    for (var i = 0; i < thumbnails.length; i++) {
      thumbnails[i].src = video.thumbnail || ('https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg');
      thumbnails[i].alt = (video.title || 'Latest Shady GG video') + ' thumbnail';
    }

    var links = document.querySelectorAll('[data-latest-link]');
    for (var l = 0; l < links.length; l++) links[l].href = video.url || ('https://www.youtube.com/watch?v=' + video.id);
  }

  function renderVideoArchive(videoList) {
    var grid = document.querySelector('[data-video-grid]');
    if (!grid) return;

    var empty = document.querySelector('[data-video-empty]');
    if (!Array.isArray(videoList) || videoList.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    grid.innerHTML = '';

    videoList.forEach(function (video) {
      var card = document.createElement('article');
      card.className = 'video-card reveal on';

      var thumb = document.createElement('div');
      thumb.className = 'video-thumb';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.src = video.thumbnail || ('https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg');
      img.alt = (video.title || 'Shady GG video') + ' thumbnail';

      var badge = document.createElement('span');
      badge.className = 'mission-badge';
      badge.innerHTML = 'Mission <b>' + formatMission(video.mission) + '</b>';

      var play = document.createElement('a');
      play.className = 'video-card-play';
      play.href = video.url || ('https://www.youtube.com/watch?v=' + video.id);
      play.target = '_blank';
      play.rel = 'noopener';
      play.setAttribute('aria-label', 'Watch ' + (video.title || 'Shady GG video'));
      play.textContent = '▶';

      thumb.appendChild(img);
      thumb.appendChild(badge);
      thumb.appendChild(play);

      var copy = document.createElement('div');
      copy.className = 'video-card-copy';

      var title = document.createElement('h3');
      title.textContent = video.title || 'Shady GG mission';

      var date = document.createElement('p');
      date.textContent = formatDate(video.publishedAt);

      var button = document.createElement('a');
      button.className = 'btn btn-primary';
      button.href = play.href;
      button.target = '_blank';
      button.rel = 'noopener';
      button.textContent = 'Watch Mission';

      copy.appendChild(title);
      copy.appendChild(date);
      copy.appendChild(button);
      card.appendChild(thumb);
      card.appendChild(copy);
      grid.appendChild(card);
    });
  }

  function addAtmosphere() {
    var atmosphere = document.createElement('div');
    atmosphere.className = 'atmosphere';
    atmosphere.setAttribute('aria-hidden', 'true');
    atmosphere.innerHTML = '<span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><div class="ember-field"></div>';
    document.body.appendChild(atmosphere);

    var emberField = atmosphere.querySelector('.ember-field');
    if (!emberField) return;

    for (var e = 0; e < 58; e++) {
      var ember = document.createElement('i');
      ember.className = 'ember-particle';
      ember.style.left = (Math.random() * 100) + '%';
      ember.style.setProperty('--size', (1.5 + Math.random() * 3.4) + 'px');
      ember.style.setProperty('--speed', (7 + Math.random() * 12) + 's');
      ember.style.setProperty('--delay', (-Math.random() * 18) + 's');
      ember.style.setProperty('--drift', (-90 + Math.random() * 180) + 'px');
      emberField.appendChild(ember);
    }
  }

  function initPage() {
    initNavigation();
    addAtmosphere();

    setText('[data-year]', new Date().getFullYear());

    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('on');
        });
      }, { threshold: 0.12 });
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('on'); });
    }

    window.addEventListener('load', function () {
      window.setTimeout(function () {
        var loader = document.querySelector('.loader');
        if (loader) loader.classList.add('hide');
      }, 300);
    });

    fetch('channel-stats.json?cache=' + Date.now(), { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Channel data is unavailable.');
        return response.json();
      })
      .then(function (stats) {
        updateChannelStats(stats);
        updateLatestVideo(stats.latestVideo || (stats.videoList && stats.videoList[0]));
        renderVideoArchive(stats.videoList || []);
      })
      .catch(function (error) {
        console.warn(error.message);
        updateChannelStats({ subscribers: 0, videos: 0, views: 0 });
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPage);
  else initPage();
}());
