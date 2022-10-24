import { React, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import styles from './MyAccount.module.scss';
import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';

export const MyAccount = () => {
  const isAuth = useSelector(selectIsAuth);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [posts, setPosts] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    axios
      .get('/auth/me')
      .then(({ data }) => {
        setAvatarUrl(data.avatarUrl);
        setFullName(data.fullName);
        setPosts(data.posts);
        setComments(data.comments);
      })
      .catch((err) => {
        console.warn(err);
        alert('Can not get user data');
      });
  }, []);

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
      <Grid classes={{ root: styles.root }} container spacing={2}>
        <Grid item xs={12} md={4}>
          <Item>
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
          <Item>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
