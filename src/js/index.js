import '../sass/main.scss';
import debounce from 'lodash.debounce';
import { error, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import 'material-design-icons/iconfont/material-icons.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
defaultModules.set(PNotifyMobile, {});

import { ApiService } from './apiService.js';
import pictureCardTpl from '../tpl/pictureCard.hbs';

const searchQueryRef = document.querySelector('input[name="query"]');
const pictureCardRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

const newApiService = new ApiService();

searchQueryRef.addEventListener('input', debounce(onInputSearch, 1000));
loadMoreBtn.addEventListener('click', onLoadMoreClick);
pictureCardRef.addEventListener('click', onOpenOriginalPicture);

function onInputSearch(e) {
  const input = e.target.value;
  clearPictureCard();
  newApiService.query = input;

  if (newApiService.query === '') {
    loadMoreBtn.classList.add('is-hidden');

    error({
      text: 'Please, enter a more specific query',
      delay: 2000,
    });
    return;
  }

  newApiService.resetPage();
  newApiService
    .fetchSearch()
    .then(renderPictureCard)
    .catch(error => error);
}

function renderPictureCard(hits) {
  if (hits.length === 0) {
    error({
      text: 'Invalid query',
      delay: 2000,
    });
    return;
  }

  onMarkup(hits);

  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, 1500);
}

function clearPictureCard() {
  pictureCardRef.innerHTML = '';
}

function onMarkup(elem) {
  pictureCardRef.insertAdjacentHTML('beforeend', pictureCardTpl(elem));
  loadMoreBtn.classList.remove('is-hidden');
}

function onLoadMoreClick(e) {
  newApiService.fetchSearch().then(renderPictureCard);
}

function onOpenOriginalPicture(e) {
  if (e.target.tagName !== 'IMG') return;

  const imgSrc = e.target.getAttribute('original-src');
  const instance = basicLightbox.create(`<img src="${imgSrc}" width="1000">`);
  instance.show();
}
