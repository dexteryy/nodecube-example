
import {
  redis,
  mongo,
} from 'nodecube';

const connectServices = {};

connectServices.redis = redis({
  host: process.env.NE_REDIS_HOST,
  port: process.env.NE_REDIS_PORT,
  password: process.env.NE_REDIS_PASSWORD,
});

connectServices.mongo = mongo({
  node1Host: process.env.NE_MONGO_NODE1_HOST,
  node1Port: process.env.NE_MONGO_NODE1_PORT,
  node2Host: process.env.NE_MONGO_NODE2_HOST,
  node2Port: process.env.NE_MONGO_NODE2_PORT,
  dbname: process.env.NE_MONGO_DB,
  replset: process.env.NE_MONGO_REPLSET,
  user: process.env.NE_MONGO_USERNAME,
  pass: process.env.NE_MONGO_PASSWORD,
});

export default connectServices;
