import type { Movie } from '../types';

const key = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

const base = 'https://api.themoviedb.org/3';

const img = (
  path: string | null,
  size = 'w500'
) => {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : '';
};

async function request<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
) {
  if (!key) {
    throw new Error('TMDB_API_KEY_MISSING');
  }

  const cleanParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => [name, String(value)])
  );

  const qs = new URLSearchParams({
    api_key: key,
    language: 'pt-BR',
    include_adult: 'false',
    ...cleanParams,
  });

  const response = await fetch(
    `${base}${path}?${qs.toString()}`
  );

  if (!response.ok) {
    throw new Error(`TMDB_${response.status}`);
  }

  return response.json() as Promise<T>;
}

interface DiscoverOptions {
  moodGenres?: number[];
  energyGenres?: number[];
  environmentGenres?: number[];
}

interface Candidate {
  movie: Movie;
  moodMatches: number;
  energyMatches: number;
  environmentMatches: number;
  sources: number;
}

function uniqueGenres(...groups: number[][]) {
  return [...new Set(groups.flat())];
}

function countMatches(
  movieGenres: number[],
  selectedGenres: number[]
) {
  return movieGenres.filter(
    genre => selectedGenres.includes(genre)
  ).length;
}

function addCandidates(
  map: Map<number, Candidate>,
  movies: Movie[],
  type: 'mood' | 'energy' | 'environment',
  genres: number[]
) {
  movies.forEach(movie => {
    if ((movie.vote_average || 0) < 6) {
      return;
    }

    const movieGenres = movie.genre_ids || [];

    const matches = countMatches(
      movieGenres,
      genres
    );

    if (matches === 0) {
      return;
    }

    const existing = map.get(movie.id);

    if (!existing) {
      map.set(movie.id, {
        movie,

        moodMatches:
          type === 'mood'
            ? matches
            : 0,

        energyMatches:
          type === 'energy'
            ? matches
            : 0,

        environmentMatches:
          type === 'environment'
            ? matches
            : 0,

        sources: 1,
      });

      return;
    }

    if (type === 'mood') {
      existing.moodMatches =
        Math.max(
          existing.moodMatches,
          matches
        );
    }

    if (type === 'energy') {
      existing.energyMatches =
        Math.max(
          existing.energyMatches,
          matches
        );
    }

    if (type === 'environment') {
      existing.environmentMatches =
        Math.max(
          existing.environmentMatches,
          matches
        );
    }

    existing.sources += 1;
  });
}

function scoreCandidate(
  candidate: Candidate
) {
  const {
    movie,
    moodMatches,
    energyMatches,
    environmentMatches,
    sources,
  } = candidate;

  let score = 0;

  /*
   * HUMOR
   *
   * Continua sendo o principal
   * fator de compatibilidade.
   */
  score += moodMatches * 30;

  /*
   * AMBIENTE
   */
  score += environmentMatches * 18;

  /*
   * ENERGIA
   */
  score += energyMatches * 8;

  /*
   * O filme apareceu em mais
   * de uma dimensão da vibe.
   */
  if (sources >= 2) {
    score += 20;
  }

  if (sources >= 3) {
    score += 25;
  }

  /*
   * HUMOR + AMBIENTE
   */
  if (
    moodMatches > 0 &&
    environmentMatches > 0
  ) {
    score += 25;
  }

  /*
   * HUMOR + ENERGIA
   */
  if (
    moodMatches > 0 &&
    energyMatches > 0
  ) {
    score += 10;
  }

  /*
   * AMBIENTE + ENERGIA
   */
  if (
    environmentMatches > 0 &&
    energyMatches > 0
  ) {
    score += 8;
  }

  /*
   * NOTA
   *
   * Ajuda na qualidade, mas não
   * deve dominar a compatibilidade.
   */
  score += Math.max(
    0,
    Math.min(
      movie.vote_average || 0,
      10
    )
  ) * 1.5;

  /*
   * POPULARIDADE
   *
   * Agora tem um peso maior.
   *
   * O objetivo é favorecer filmes
   * conhecidos sem transformar
   * popularidade no único critério.
   */
  const popularity =
    Math.max(
      movie.popularity || 0,
      0
    );

  const popularityBonus =
    Math.min(
      Math.log10(
        popularity + 1
      ) * 6,
      20
    );

  score += popularityBonus;

  return score;
}

function rankCandidates(
  candidates: Candidate[]
) {
  return candidates
    .sort((a, b) => {
      const scoreA =
        scoreCandidate(a);

      const scoreB =
        scoreCandidate(b);

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      /*
       * Primeiro desempate:
       * mais dimensões compatíveis.
       */
      if (b.sources !== a.sources) {
        return (
          b.sources -
          a.sources
        );
      }

      /*
       * Segundo desempate:
       * maior nota.
       */
      return (
        (b.movie.vote_average || 0) -
        (a.movie.vote_average || 0)
      );
    })
    .map(
      candidate =>
        candidate.movie
    );
}

async function discoverByGenres(
  genres: number[]
) {
  if (genres.length === 0) {
    return [];
  }

  /*
   * Duas páginas para aumentar
   * a quantidade de candidatos.
   */
  const pages = [1, 2];

  const responses =
    await Promise.all(
      pages.map(page =>
        request<{
          results: Movie[];
        }>(
          '/discover/movie',
          {
            /*
             * Usamos popularidade apenas
             * para trazer candidatos melhores
             * e mais conhecidos.
             *
             * O ranking final é feito
             * pelo nosso algoritmo.
             */
            sort_by:
              'popularity.desc',

            with_genres:
              genres.join('|'),

            vote_count_gte: 150,

            vote_average_gte: 6,

            page,
          }
        )
      )
    );

  return responses
    .flatMap(
      response =>
        response.results
    )
    .filter(
      (movie, index, array) =>
        array.findIndex(
          item =>
            item.id === movie.id
        ) === index
    );
}

export const tmdb = {
  async discover(
    options: DiscoverOptions = {}
  ) {
    const moodGenres =
      uniqueGenres(
        options.moodGenres || []
      );

    const energyGenres =
      uniqueGenres(
        options.energyGenres || []
      );

    const environmentGenres =
      uniqueGenres(
        options.environmentGenres || []
      );

    /*
     * Fazemos três buscas independentes:
     *
     * 1. Humor
     * 2. Energia
     * 3. Ambiente
     */
    const [
      moodMovies,
      energyMovies,
      environmentMovies,
    ] = await Promise.all([
      discoverByGenres(
        moodGenres
      ),

      discoverByGenres(
        energyGenres
      ),

      discoverByGenres(
        environmentGenres
      ),
    ]);

    const candidates =
      new Map<number, Candidate>();

    /*
     * HUMOR
     */
    addCandidates(
      candidates,
      moodMovies,
      'mood',
      moodGenres
    );

    /*
     * ENERGIA
     */
    addCandidates(
      candidates,
      energyMovies,
      'energy',
      energyGenres
    );

    /*
     * AMBIENTE
     */
    addCandidates(
      candidates,
      environmentMovies,
      'environment',
      environmentGenres
    );

    /*
     * Ranking final.
     */
    const ranked =
      rankCandidates(
        Array.from(
          candidates.values()
        )
      );

    /*
     * Priorizamos filmes que:
     *
     * - combinam com o humor
     * - aparecem em pelo menos
     *   duas dimensões da vibe
     */
    const strongMatches =
      ranked.filter(movie => {
        const candidate =
          candidates.get(
            movie.id
          );

        if (!candidate) {
          return false;
        }

        return (
          candidate.sources >= 2 &&
          candidate.moodMatches > 0
        );
      });

    /*
     * Se não houver 6 combinações fortes,
     * completamos com os melhores restantes.
     */
    const selected = [
      ...strongMatches,

      ...ranked.filter(
        movie =>
          !strongMatches.some(
            selectedMovie =>
              selectedMovie.id ===
              movie.id
          )
      ),
    ].slice(0, 6);

    return selected.map(
      movie => ({
        ...movie,

        poster_path:
          img(
            movie.poster_path
          ),

        backdrop_path:
          img(
            movie.backdrop_path,
            'w1280'
          ),
      })
    );
  },

  async popular() {
    const data =
      await request<{
        results: Movie[];
      }>(
        '/movie/popular',
        {
          page: 1,
        }
      );

    return data.results.map(
      movie => ({
        ...movie,

        poster_path:
          img(
            movie.poster_path
          ),

        backdrop_path:
          img(
            movie.backdrop_path,
            'w1280'
          ),
      })
    );
  },

  async search(
    query: string
  ) {
    const data =
      await request<{
        results: Movie[];
      }>(
        '/search/movie',
        {
          query,
          page: 1,
        }
      );

    return data.results.map(
      movie => ({
        ...movie,

        poster_path:
          img(
            movie.poster_path
          ),

        backdrop_path:
          img(
            movie.backdrop_path,
            'w1280'
          ),
      })
    );
  },

  async details(
    id: number
  ) {
    const movie =
      await request<
        Movie & {
          runtime: number;

          genres: {
            id: number;
            name: string;
          }[];
        }
      >(
        `/movie/${id}`,
        {}
      );

    return {
      ...movie,

      poster_path:
        img(
          movie.poster_path
        ),

      backdrop_path:
        img(
          movie.backdrop_path,
          'w1280'
        ),
    };
  },
};