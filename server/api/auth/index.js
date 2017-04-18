
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
import User from '../common/model/User';
import {
  errorTrigger,
  errorResponse,
  authorization,
} from 'nodecube';

const JWT_SECRET = process.env.NE_JWT_SECRET;
const SALT_ROUNDS = 10;

const {
  authorized,
  unauthorized,
} = authorization({
  jwtSecret: JWT_SECRET,
  publicPath: [
    '/api/signin',
    '/api/signup',
    /\/api\/github/,
  ],
});

export {
  authorized,
  unauthorized,
};

const userInfo = user => {
  return {
    username: user.username,
    email: user.email,
  };
};

export const authAPI = Router();

authAPI.post('/signup', async function (req, res) {
  const {
    username: customUsername,
    email,
    password,
  } = req.body;
  req.checkBody('username', 'Invalid username').isUsername();
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty().isPassword();
  try {
    if (req.validationErrors()) {
      errorTrigger({
        status: -2,
        message: 'INVALID EMAIL OR PASSWORD',
      });
    }
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
    const username = customUsername || `user_${shortid.generate()}`;
    let hash;
    try {
      hash = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
      errorTrigger({
        status: -3,
        message: 'PW HASH ERROR',
      });
    }
    const user = await User.findOne({
      $or: [{
        email,
      }, {
        username,
      }],
    }).exec();
    if (!user) {
      await new User({
        ...userInfo({
          username,
          email,
        }),
        password: hash,
      }).save();
    } else if (user.username === username) {
      errorTrigger({
        status: -1,
        message: `USERNAME ALREADY EXIST: ${username}`,
      });
    } else {
      errorTrigger({
        status: -4,
        message: `EMAIL ALREADY EXIST: ${user.email}`,
      });
    }
    logger.info(`Successful create user: ${email}`);
    res.json({
      status: 0,
      username,
      email,
    });
  } catch (ex) {
    errorResponse(req, res)(ex);
  }
});

authAPI.post('/signin', async function (req, res) {
  const {
    id,
    password,
  } = req.body;
  try {
    const user = await User.findOne(/@/.test(id) ? {
      email: id,
    } : {
      username: id,
    }).exec();
    if (!user) {
      errorTrigger({
        status: -2,
        message: `WRONG ID: ${id}`,
      });
    }
    let isEqual;
    try {
      isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error();
      }
    } catch (err) {
      errorTrigger({
        status: -1,
        message: 'WRONG PASSWORD',
      });
    }
    const info = userInfo(user);
    const results = await new Promise(resolve => {
      jwt.sign({
        ...info,
      }, JWT_SECRET, {}, (err, token) => {
        if (err) {
          resolve({
            status: -4,
            message: `JWT ERROR: ${err.message}`,
          });
        } else {
          resolve({
            status: 0,
            token,
            ...info,
          });
        }
      });
    });
    res.json(results);
  } catch (ex) {
    errorResponse(req, res)(ex);
  }
});

authAPI.get('/account', (req, res) => {
  res.json({
    ...userInfo(req.user),
  });
});
