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
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 850) setMenu(false);
    });
  }

  function initPage() {
    initNavigation();

    var years = document.querySelectorAll('[data-year]');
    for (var y = 0; y < years.length; y++) years[y].textContent = new Date().getFullYear();

    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) entries[i].target.classList.add('on');
        }
      }, { threshold: 0.12 });
      for (var r = 0; r < revealItems.length; r++) observer.observe(revealItems[r]);
    } else {
      for (var f = 0; f < revealItems.length; f++) revealItems[f].classList.add('on');
    }

    window.addEventListener('load', function () {
      window.setTimeout(function () {
        var loader = document.querySelector('.loader');
        if (loader) loader.classList.add('hide');
      }, 300);
    });

    var atmosphere = document.createElement('div');
    atmosphere.className = 'atmosphere';
    atmosphere.setAttribute('aria-hidden', 'true');
    atmosphere.innerHTML = '<span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><span class="smoke-cloud"></span><div class="ember-field"></div>';
    document.body.appendChild(atmosphere);

    var emberField = atmosphere.querySelector('.ember-field');
    if (emberField) {
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

    function updateChannelStats(stats) {
      var subscribers = Number(stats.subscribers) || 0;
      var videos = Number(stats.videos) || 0;
      var views = Number(stats.views) || 0;

      var subscriberCounts = document.querySelectorAll('[data-subscriber-count]');
      for (var s = 0; s < subscriberCounts.length; s++) subscriberCounts[s].textContent = subscribers.toLocaleString();

      var videoCounts = document.querySelectorAll('[data-video-count]');
      for (var v = 0; v < videoCounts.length; v++) videoCounts[v].textContent = videos.toLocaleString();

      var viewCounts = document.querySelectorAll('[data-view-count]');
      for (var w = 0; w < viewCounts.length; w++) viewCounts[w].textContent = views.toLocaleString();

      var updated = document.querySelectorAll('[data-stats-updated]');
      var updatedDate = stats.updatedAt ? new Date(stats.updatedAt) : null;
      var updatedText = updatedDate && !isNaN(updatedDate.getTime())
        ? updatedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
        : 'Waiting for first update';
      for (var u = 0; u < updated.length; u++) updated[u].textContent = updatedText;

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

    fetch('channel-stats.json?cache=' + Date.now(), { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Channel statistics are unavailable.');
        return response.json();
      })
      .then(updateChannelStats)
      .catch(function (error) {
        console.warn(error.message);
        updateChannelStats({ subscribers: 0, videos: 0, views: 0 });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
}());
