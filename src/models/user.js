const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required:true,
      minlength: 7,
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'admin'],
    },
    phone: {
      type: String,
    },
    
  },
);



userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'mySecret',{expiresIn: '60s'});
  return token;
};
userSchema.methods.generateRefreshToken=async function(){
  const user=this;
  const tokenRefresh=jwt.sign({ _id: user._id.toString()},'Refresh',{expiresIn:'1y'})
  return tokenRefresh;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');

  return user;
};

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
