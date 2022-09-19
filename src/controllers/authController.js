const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const { User } = require('../models');

// const { request } = require('express');

const genToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || 'private_key', {
    expiresIn: process.env.JWT_EXPIRES || '1d',
  });

exports.register = async (req, res, next) => {
  console.log(User);
  try {
    const { firstName, lastName, emailOrMobile, password, confirmPassword } =
      req.body;

    if (!emailOrMobile) {
      //   res.status(400).json({ message: 'Email or mobile is required' });
      throw new AppError('Email address or mobile is required', 400);
    }

    if (!password) {
      throw new AppError('Password is required', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Password and Confirm Password did not match', 400);
    }

    const isEmail = validator.isEmail(emailOrMobile + '');
    const isMobile = validator.isMobilePhone(emailOrMobile + '');

    if (!isEmail && !isMobile) {
      throw new AppError('Email address or mobile is invalid format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? emailOrMobile : null,
      mobile: isMobile ? emailOrMobile : null,
      password: hashedPassword,
    });
    console.log(firstName);
    console.log(user);

    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
