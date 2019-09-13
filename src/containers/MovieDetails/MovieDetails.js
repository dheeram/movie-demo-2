import React, { Component } from 'react';
import { withLastLocation } from 'react-router-last-location';
import { getMovieDetailsById, getMovieReviews } from '../../services/movieAPI';
import {
  BASE_BACKDROP_PATH,
  BASE_POSTER_PATH,
} from '../../constants/Constants';
import Review from '../../components/Review/Review';
import './MovieDetails.scss';

class MovieDetails extends Component {
  state = {
    movieInfo: null,
    movieReviews: null,
    loading: true,
    error: true,
  };

  async componentDidMount() {
    if (this.props.match.params.id) {
      try {
        const movieInfo = await getMovieDetailsById(this.props.match.params.id);
        const movieReviews = await getMovieReviews(this.props.match.params.id);
        this.setState({
          loading: false,
          movieInfo,
          movieReviews,
          error: false,
        });
      } catch (err) {
        this.setState({ loading: false, error: true });
      }
    }
  }

  render() {
    const { movieInfo, loading, movieReviews, error } = this.state;
    let reviews;
    let otherReviews;
    let pathname;

    if (this.props.lastLocation === null) {
      pathname = '/';
    } else {
      pathname = this.props.lastLocation.pathname;
    }

    if (movieReviews && movieReviews.length > 2) {
      const prevReviews = movieReviews.slice(0, 2);
      otherReviews = movieReviews.length - 2;
      reviews = prevReviews.map(review => {
        return (
          <Review key={review.id} author={review.author} review={review} />
        );
      });
    } else if (movieReviews && movieReviews.length <= 2) {
      reviews = movieReviews.map(review => {
        return (
          <Review key={review.id} author={review.author} review={review} />
        );
      });
    }

    let movieDetails = null;

    if (error) {
      movieDetails = (
        <h3>Woops, something went wrong trying to fetch movie details.</h3>
      );
    }

    if (loading) {
      movieDetails = (
        <>
          <h1>Movie Details</h1>
          <h3>Loading movie details now...</h3>
        </>
      );
    }

    if (!loading && movieInfo) {
      movieDetails = (
        <div className="movie-details-wrapper">
          <div className="movie-details-title">
            <i
              className="fa fa-chevron-left"
              onClick={() => this.props.history.push(`${pathname}`)}
              aria-hidden="true"
            />
            <h1>{movieInfo.title}</h1>
          </div>
          <img
            className="movie-details-backdrop"
            src={`${BASE_BACKDROP_PATH}${movieInfo.backdrop_path}`}
            alt="movie background"
          />
          <div className="movie-details-poster-wrapper">
            <img
              className="movie-details-poster"
              src={`${BASE_POSTER_PATH}/w500${movieInfo.poster_path}`}
              alt="movie poster"
            />
            <div className="movie-details-info">
              <div>
                <strong>Movie Overview:</strong> {movieInfo.overview}
              </div>
              <div>
                <strong>Release Date:</strong> {movieInfo.release_date}
              </div>
              <div>
                <strong>Average Rating:</strong> {movieInfo.vote_average}
              </div>
            </div>
            {reviews && reviews.length > 0 && (
              <div className="movie-details-reviews">
                <strong>Reviews:</strong>
                {reviews}
                {otherReviews && (
                  <p>
                    {otherReviews} additional
                    {otherReviews === 1 ? ' review' : ' reviews'} not shown here
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return <>{movieDetails}</>;
  }
}

export default withLastLocation(MovieDetails);
