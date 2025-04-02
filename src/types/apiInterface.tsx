interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  }
  page: number;
  results: IMovie[]
  total_pages: number;
  total_results: number;
}