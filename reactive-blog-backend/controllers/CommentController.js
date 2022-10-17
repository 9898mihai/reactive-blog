import CommentModel from '../models/Comment.js';

export const addComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.params.id,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to add comment',
    });
  }
};
