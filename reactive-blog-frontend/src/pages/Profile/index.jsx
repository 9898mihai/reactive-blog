import { React, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Profile.module.scss';
import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';

export const Profile = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const [oldFullName, setOldFullName] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const inputFileRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    axios
      .get('/auth/me')
      .then(({ data }) => {
        setOldFullName(data.fullName);
        setAvatarUrl(data.avatarUrl);
      })
      .catch((err) => {
        console.warn(err);
        alert('Can not get user data');
      });
  }, []);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setAvatarUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Error uploading avatar!');
    }
  };

  const onSubmit = async () => {
    try {
      const fields = {
        fullName,
        avatarUrl,
        password,
      };

      await axios.patch('/update/me', fields);

      navigate('/');
    } catch (err) {
      console.warn(err);
      alert('Error on user updating');
    }
  };

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        {oldFullName}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
          <Avatar
            onClick={() => inputFileRef.current.click()}
            sx={{ width: 100, height: 100, cursor: 'pointer' }}
            src={avatarUrl ? `http://localhost:4444${avatarUrl}` : ''}
          />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          onChange={(e) => setFullName(e.target.value)}
          className={styles.field}
          label="New full name"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.field}
          label="New password"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Update
        </Button>
      </form>
    </Paper>
  );
};
