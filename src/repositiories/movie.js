import Movie from '../schema/movie.js'
import crudRepository from './crudRepository.js'
const movieRepository = {
    ...crudRepository(Movie),
}
export default movieRepository;