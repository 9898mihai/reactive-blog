import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Profile.module.scss';
import axios from '../../axios';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

export const Profile = () => {
  const isAuth = useSelector(selectIsAuth);
  const [fullName, setFullName] = useState('');
  const dispatch = useDispatch();
  const {
    replace,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      alert('Unable to register');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  useEffect(() => {
    axios
      .get('/auth/me')
      .then(({ data }) => {
        setFullName(data.fullName);
      })
      .catch((err) => {
        console.warn(err);
        alert('Can not get user data');
      });
  }, []);

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        {fullName}
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...replace('fullName', { required: 'Invalid name' })}
          className={styles.field}
          label="New full name"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...replace('password', { required: 'Invalid password' })}
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
