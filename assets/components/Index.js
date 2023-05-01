import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const Index = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(null);
  const [order, setOrder] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  const fetchMovies = () => {
    setLoading(true);

    let url = '/api/movies';

    if (sort && order) {
      url += `?sort=${sort}&order=${order}`;
    }

    if (selectedGenre !== "") {
      url += `&genre=${selectedGenre}`;
    }

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovies(data.movies);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, [sort, order]);

  const handleSortByRank = () => {
    setSort('rating');
    setOrder('desc');
  };

  const handleSortByDate = () => {
    setSort('year');
    setOrder('desc');
  };

  const handleSortDefault = () => {
    setSort('year');
    setOrder('asc');
  };

  return (
    <Layout>
      <Heading />
      <Filters 
        handleSortByRank={handleSortByRank}
        handleSortByDate={handleSortByDate}
        handleSortDefault={handleSortDefault}
      />
      <MovieList loading={loading}>
        {movies
        .filter(movie => selectedGenre === "" || movie.genre === selectedGenre)
        .map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Filters = props => {

  const handleGenreChange = event => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
      <button
        type="button"
        className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
        onClick={props.handleSortDefault}
      >
        All films
      </button>
      <button
        type="button"
        className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
        onClick={props.handleSortByRank}
      >
        Top rank
      </button>
      <button
        type="button"
        className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
        onClick={props.handleSortByDate}
      >
        Latest releases
      </button>
      <GenreFilter
        selectedGenre={props.selectedGenre}
        handleGenreChange={props.handleGenreChange}
        genres={props.genres}
      />
    </div>
  );
};

const GenreFilter = props => {

  const [genres, setGenres] = useState([]);

  const fetchGenres = async () => {

    let url = '/api/genres';

    const response = await fetch(url);
    const data = await response.json();
    setGenres(data.genres);
  }

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <select
      value={props.selectedGenre}
      onChange={props.handleGenreChange}
      className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center mr-3 mb-3 dark:text-white dark:focus:ring-gray-800"
    >
      {/* <option key="0" value="all_cat">All categories</option> */}
      {genres.map(item => (
        <option key={item.id} value={item.value}>
          {item.value}
        </option>
      ))}
    </select>
  );
};



const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.image}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipedia_url
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipedia_url, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default Index;
