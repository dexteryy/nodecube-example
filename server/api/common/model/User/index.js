
import mongoose from 'mongoose';
import connectServices from '../../../../utils/connectServices';
import isEmail from 'validator/lib/isEmail';
import {
  RE_SPECIAL_CHAR,
  stringLengthByDoubleByte,
  isUsername,
  isPassword,
} from '../../../../utils/validators';

const {
  mongo,
} = connectServices;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    validate: {
      validator: isUsername,
      message: '{VALUE} is not a valid username!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: '{VALUE} is not a valid email!',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: isPassword,
      message: '{VALUE} is not a valid password!',
    },
  },
  sheet: {
    name: {
      type: String,
      'default': '',
      validate: {
        validator(value) {
          if (value === '') {
            return true;
          }
          const length = stringLengthByDoubleByte(value);
          if (RE_SPECIAL_CHAR.test(value)
              || length < 2
              || length > 10) {
            return false;
          }
          return true;
        },
        message: '{VALUE} is not a valid name!',
      },
    },
    desc: {
      type: String,
      'default': '',
      validate: {
        validator(value) {
          if (value === '') {
            return true;
          }
          const length = stringLengthByDoubleByte(value);
          if (length > 30) {
            return false;
          }
          return true;
        },
        message: '{VALUE} is not a valid desc!',
      },
    },
    phone: {
      type: String,
      'default': '',
    },
    wechat: {
      type: String,
      'default': '',
    },
    qq: {
      type: String,
      'default': '',
    },
    address: {
      type: String,
      'default': '',
    },
  },
}, {
  autoIndex: true,
  emitIndexErrors: true,
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    versionKey: false,
    getters: true,
    transform: (doc, json) => {
      delete json.password;
      delete json._id;
      delete json.id;
    },
  },
});

const User = mongo.model('User', userSchema);

export default User;
