import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Not registered',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Incorrect login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Not logged',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .populate('posts')
      .populate('comments');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'No acces',
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    let fullName = user.fullName;
    let hash = user.passwordHash;

    if (req.body.fullName) {
      fullName = await req.body.fullName;
    }

    if (
      req.body.fullName &&
      req.body.currentPassword &&
      req.body.newPassword === ''
    ) {
      return res.status(400).json({
        message: 'Incorrect password',
      });
    }

    if (req.body.currentPassword && req.body.newPassword) {
      const isValidPass = await bcrypt.compare(req.body.currentPassword, hash);

      if (isValidPass) {
        const password = await req.body.newPassword;
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
      } else {
        return res.status(400).json({
          message: 'Incorrect password',
        });
      }
    }

    await UserModel.updateOne(
      {
        _id: user,
      },
      {
        fullName: fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      }
    );

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update user',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .populate('posts')
      .populate('comments');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'No acces',
    });
  }
};
