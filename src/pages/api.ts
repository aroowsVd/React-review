const API_KEY = "aea3a683534b520158f88c0647ed60cb"
const BASE_PATH = "https://api.themoviedb.org/3"

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWEzYTY4MzUzNGI1MjAxNThmODhjMDY0N2VkNjBjYiIsIm5iZiI6MTc0MzU5OTYxNC40NTUwMDAyLCJzdWIiOiI2N2VkMzdmZTA2MDcyMDcwNzBjZTVjNDEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wqX88hAEy1ZpspD5fZOiWTcyCgb8XJR7Nl-dt9ONVRs'
  }
};

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?language=en-US&page=1`, options).then(res => res.json())
}