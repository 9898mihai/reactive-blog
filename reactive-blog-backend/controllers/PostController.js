import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: 'desc' })
      .populate('user')
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve articles',
    });
  }
};

export const getPopular = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewsCount: 'desc' })
      .populate('user')
      .limit(5)
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve popular articles',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Unable to return article',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Article not found',
          });
        }

        res.json(doc);
      }
    )
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve articles',
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const posts = await PostModel.find({ tags: req.params.tag })
      .sort({ createdAt: 'desc' })
      .populate('user')
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve articles',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(3).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 3);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get tags',
    });
  }
};

export const remove = async (req, res) => {
  PostModel.findOneAndRemove({ _id: req.params.id })
    .populate('comments')
    .then(async (foundPost) => {
      // delete Comment references from User
      await foundPost.comments.forEach(async (comment) => {
        await UserModel.findByIdAndUpdate(comment.user._id, {
          $pull: { comments: comment._id },
        });
      });
      // delete Post reference from User author
      await UserModel.findByIdAndUpdate(foundPost.user, {
        $pull: { posts: foundPost._id },
      });
      // delete all child Comments
      await CommentModel.deleteMany({
        post: foundPost._id,
      });
    })
    .catch(() => res.status(500).json({ message: 'Failed to delete post' }));
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    const userRelated = await UserModel.findById(req.userId);
    userRelated.posts.push(post);
    await userRelated.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create article',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update article',
    });
  }
};
