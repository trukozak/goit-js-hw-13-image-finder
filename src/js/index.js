import '../sass/main.scss';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import 'material-design-icons/iconfont/material-icons.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import { ApiService } from './apiService.js';
import pictureCardTpl from '../tpl/pictureCard.hbs';

const searchQueryRef = document.querySelector('.search-form');
const pictureCardRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

const newApiService = new ApiService();

searchQueryRef.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
pictureCardRef.addEventListener('click', onOpenOriginalPicture);

function onSearch(e) {
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.query.value;
  newApiService.resetPage();
  clearPictureCard();

  newApiService
    .fetchSearch()
    .then(renderPictureCard)
    .catch(error => error);

  if (newApiService.query === '') {
    error({
      text: 'Please, enter a more specific query',
      delay: 1000,
    });
  }
}

function renderPictureCard(hits) {
  loadMoreBtn.classList.remove('is-hidden');
  onMarkup(hits);
  if (hits.length < 12) {
    loadMoreBtn.classList.add('is-hidden');
  }

  if (hits.length === 0) {
    error({
      text: 'Correct request',
      delay: 1000,
    });
    return;
  }

  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, 2000);
}

function clearPictureCard() {
  pictureCardRef.innerHTML = '';
}

function onMarkup(elem) {
  pictureCardRef.insertAdjacentHTML('beforeend', pictureCardTpl(elem));
  if (newApiService.query === '') {
    clearPictureCard();
    loadMoreBtn.classList.add('is-hidden');
  }
}

function onLoadMoreClick(e) {
  newApiService.fetchSearch().then(renderPictureCard);
}

function onOpenOriginalPicture(e) {
  if (e.target.tagName !== 'IMG') return;

  const imgSrc = e.target.getAttribute('data-original-src');
  const instance = basicLightbox.create(`<img src="${imgSrc}" width="1000">`);
  instance.show();
}
