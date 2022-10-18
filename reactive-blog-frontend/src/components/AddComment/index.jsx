import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.data);
  const [text, setText] = useState('');
  const [isEmpty, setEmpty] = useState(true);

  useEffect(() => {
    if (text !== '') {
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  }, [text]);

  const onSubmit = async () => {
    try {
      const fields = {
        text,
      };

      await axios.post(`/posts/${id}/comment`, fields);

      setText('');
      navigate(0);
    } catch (err) {
      console.warn(err);
      alert('Error on comment adding');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={
            userData.avatarUrl
              ? `http://localhost:4444${userData.avatarUrl}`
              : '/noavatar.png'
          }
        />
        <div className={styles.form}>
          <TextField
            label="Write a comment"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained" disabled={isEmpty}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
