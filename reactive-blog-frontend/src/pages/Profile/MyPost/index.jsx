import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRemovePost } from '../../../redux/slices/posts';

import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './MyPost.module.scss';

export const MyPost = ({
  id,
  createdAt,
  title,
  viewsCount,
  commentsCount,
  isEditable,
  handlePostDeleted,
}) => {
  const dispatch = useDispatch();

  const onClickRemove = () => {
    if (window.confirm('Are you sure you want to delete post?')) {
      dispatch(fetchRemovePost(id));
      handlePostDeleted(id);
    }
  };

  return (
    <div className={clsx(styles.root)}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <div className={styles.wrapper}>
        <div className={styles.date}>{createdAt}</div>
        <div className={styles.indention}>
          <h2 className={clsx(styles.title)}>
            <Link to={`/posts/${id}`}>{title}</Link>
          </h2>
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
