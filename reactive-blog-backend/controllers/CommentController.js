import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const addComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.params.id,
      user: req.userId,
    });

    const comment = await doc.save();

    const postRelated = await PostModel.findById(req.params.id);
    postRelated.comments.push(comment);
    await postRelated.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to add comment',
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .sort({ createdAt: 'desc' })
      .limit(2)
      .populate('user')
      .exec();
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get comments',
    });
  }
};
