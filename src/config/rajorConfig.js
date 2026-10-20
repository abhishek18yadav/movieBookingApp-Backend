import razorpay from 'razorpay';

import { RAJOR_API_KEY, RAZOR_API_SECRET } from './serverConfig.js';

const instance = new razorpay({
    key_id: RAJOR_API_KEY,
    key_secret: RAZOR_API_SECRET,
});
export default instance;