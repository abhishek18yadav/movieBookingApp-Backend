import crudRepository from './crudRepository.js'
import Movie from '../schema/movie.js'
const movieRepository = {
    ...crudRepository(Movie),
}