import Refund from '../schema/refund.js';
import crudRepository from './crudRepository.js';

const refundRepository = {
    ...crudRepository(Refund)
};

export default refundRepository;
