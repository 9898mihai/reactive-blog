import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';

import styles from './MyPost.module.scss';

import { fetchRemoveComment } from '../../../redux/slices/posts';

export const MyComment = ({
  postId,
  commentId,
  createdAt,
  text,
  isEditable,
  handleCommentDeleted,
}) => {
  const dispatch = useDispatch();

  const onClickRemove = () => {
    if (window.confirm('Are you sure you want to delete comment?')) {
      let params = {
        postId: postId,
        commentId: commentId,
      };
      dispatch(fetchRemoveComment(params));
      handleCommentDeleted(commentId);
    }
  };

  return (
    <div className={clsx(styles.root)}>
      {isEditable && (
        <div className={styles.editButtons}>
          <IconButton
            onClick={() => onClickRemove(commentId)}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <div className={styles.wrapper}>
        <div className={styles.date}>{createdAt}</div>

        <div className={styles.indention}>
          <p className={clsx(styles.comment)}>
            <Link to={`/posts/${postId}`}>{text}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
