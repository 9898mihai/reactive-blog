import { React, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

import styles from './Account.module.scss';
import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';

export const Account = () => {
  const isAuth = useSelector(selectIsAuth);
  const [oldFullName, setOldFullName] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const inputFileRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setAvatarUrl(data.url);
      setDisabled(false);
    } catch (err) {
      console.warn(err);
      alert('Error uploading avatar!');
    }
  };

  useEffect(() => {
    if (fullName !== '' || newPassword !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [fullName, newPassword]);

  useEffect(() => {
    if (fullName !== '' || newPassword !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    if (newPassword === '' && currentPassword !== '') {
      setDisabled(false);
    }
  }, [fullName, newPassword]);

  useEffect(() => {
    if (currentPassword === '') {
      setNewPassword('');
    }
    if (currentPassword !== '' && newPassword === '') {
      setDisabled(true);
    }
  }, [currentPassword]);

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
  }, [isAuth]);

  const onSubmit = async () => {
    try {
      const fields = {
        fullName,
        avatarUrl,
        currentPassword,
        newPassword,
      };

      await axios.patch('/update/me', fields);

      setSuccess(true);
      setError(false);
    } catch (err) {
      console.warn(err);
      setError(true);
      setSuccess(false);
    }
  };

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper
      classes={{ root: styles.root }}
      sx={{ width: { xs: '100%', sm: '400px' } }}
    >
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
          <Tooltip title="New avatar">
            <Avatar
              onClick={() => inputFileRef.current.click()}
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              src={avatarUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:4444'}${avatarUrl}` : ''}
            />
          </Tooltip>
          <EditIcon
            onClick={() => inputFileRef.current.click()}
            sx={{ cursor: 'pointer' }}
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
        <Divider sx={{ marginBottom: 2 }} />
        <Box mb={1} display="flex" justifyContent="center" alignItems="center">
          <Box hidden={changePassword}>
            <Button
              variant="text"
              onClick={() => {
                setChangePassword(true);
              }}
            >
              Change password
            </Button>
          </Box>
        </Box>
        <Box hidden={!changePassword}>
          <TextField
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            type="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.field}
            label="Current password"
            fullWidth
          />
          <TextField
            disabled={currentPassword === ''}
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.field}
            label="New password"
            fullWidth
          />
        </Box>
        <Button
          disabled={disabled}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Update
        </Button>
      </form>
      <Collapse sx={{ pt: 2 }} in={success}>
        <Alert severity="success">
          <AlertTitle sx={{ my: 0 }}>Profile updated</AlertTitle>
        </Alert>
      </Collapse>
      <Collapse sx={{ pt: 2 }} in={error}>
        <Alert severity="error">
          <AlertTitle sx={{ my: 0 }}>Something went wrong</AlertTitle>
        </Alert>
      </Collapse>
    </Paper>
  );
};
