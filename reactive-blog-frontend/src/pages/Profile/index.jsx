import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './Profile.module.scss';
import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';
import { MyPost } from './MyPost';
import { MyComment } from './MyPost/MyComment';

export const Profile = () => {
  const isAuth = useSelector(selectIsAuth);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [posts, setPosts] = useState('');
  const [comments, setComments] = useState('');
  const [tab, setTab] = useState(0);
  const [postDeleted, setPostDeleted] = useState('');
  const [commentDeleted, setCommentDeleted] = useState('');
  const handlePostDeleted = (id) => {
    setPostDeleted(id);
  };
  const handleCommentDeleted = (id) => {
    setCommentDeleted(id);
  };

  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    axios
      .get('/auth/me')
      .then(({ data }) => {
        setAvatarUrl(data.avatarUrl);
        setFullName(data.fullName);
        setPosts(data.posts.filter((post) => post._id !== postDeleted));
        setComments(
          data.comments.filter((comment) => comment._id !== commentDeleted)
        );
      })
      .catch((err) => {
        console.warn(err);
        alert('Can not get user data');
      });
  }, [postDeleted, commentDeleted]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#FFF',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#1A2027',
    border: '1px solid',
    borderColor: '#dedede',
  }));

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Item classes={{ root: styles.profile }}>
            <div className={styles.avatar}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={avatarUrl ? `http://localhost:4444${avatarUrl}` : ''}
              />
            </div>
            <Typography classes={{ root: styles.title }} variant="h5">
              {fullName}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} classes={{ root: styles.subtitle }}>
              <Grid item md={6}>
                <Item>Posts: {posts.length}</Item>
              </Grid>
              <Grid item md={6}>
                <Item>Comments: {comments.length}</Item>
              </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={12} md={8}>
          <Tabs
            style={{ marginBottom: 15 }}
            value={tab}
            onChange={handleChange}
          >
            <Tab label="Posts" />
            <Tab label="Commnets" />
          </Tabs>
          {tab === 0
            ? Array.from(posts)
                .reverse()
                .map((obj, index) => (
                  <MyPost
                    key={index}
                    id={obj._id}
                    title={obj.title}
                    createdAt={new Date(obj.createdAt).toLocaleDateString()}
                    viewsCount={obj.viewsCount}
                    commentsCount={obj.comments.length}
                    isEditable
                    handlePostDeleted={handlePostDeleted}
                  />
                ))
            : Array.from(comments)
                .reverse()
                .map((obj, index) => (
                  <MyComment
                    key={index}
                    postId={obj.post}
                    commentId={obj._id}
                    text={obj.text}
                    createdAt={new Date(obj.date).toLocaleDateString()}
                    isEditable
                    handleCommentDeleted={handleCommentDeleted}
                  />
                ))}
        </Grid>
      </Grid>
    </Box>
  );
};
