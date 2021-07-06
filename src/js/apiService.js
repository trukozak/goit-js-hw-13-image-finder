class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchSearch() {
    const API_KEY = '22383976-cf7d14ba7c90a10ff595fad95';
    const BASE_URL = 'https://pixabay.com/api';
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

    return fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.pageIncr();
        return data.hits;
      });
  }

  pageIncr() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export { ApiService };
