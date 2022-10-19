import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { SideBlock } from './SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import styles from './Post/Post.module.scss';

import { fetchRemoveComment } from '../redux/slices/posts';

export const CommentsBlock = ({
  items,
  children,
  isLoading,
  handleCommentId,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { id } = useParams();
  const location = useLocation();

  const onClickRemove = async (commentId) => {
    if (window.confirm('Are you sure you want to delete comment?')) {
      let params = {
        id,
        commentId,
      };
      dispatch(fetchRemoveComment(params));
      handleCommentId(commentId);
    }
  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" className={styles.coomentRoot}>
              {userData?._id === obj?.user?._id && location.pathname !== '/' && (
                <div className={styles.deleteButton}>
                  <IconButton
                    onClick={() => onClickRemove(obj._id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={obj.user.fullName}
                    src={
                      obj.user.avatarUrl
                        ? `http://localhost:4444${obj.user.avatarUrl}`
                        : ''
                    }
                  />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
