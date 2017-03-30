
import { httpService } from 'nodecube';
import api from './api';
import connectServices from './utils/connectServices';
import * as validators from './utils/validators';

const { service, server } = httpService({
  connectServices,
  validators,
  corsWhitelist: [
    'http://localhost:8003',
  ],
});

service.use('/api', api);

export default server;
