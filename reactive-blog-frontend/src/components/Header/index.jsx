import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CreateIcon from '@mui/icons-material/Create';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { selectIsAuth, logout } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const customStyles = {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 380,
    zIndex: 1,
    border: '1px solid #dedede',
    p: 1,
    bgcolor: 'background.paper',
  };

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>REACTIVE BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ position: 'relative' }}>
                  <Link to="/add-post">
                    <Button variant="outlined" startIcon={<CreateIcon />}>
                      Write an article
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    onClick={handleClick}
                    startIcon={<AccountCircleIcon />}
                  >
                    Profile
                  </Button>
                  {open ? (
                    <Box sx={customStyles}>
                      <Link to="/add-post">
                        <Button
                          onClick={handleClick}
                          variant="contained"
                          startIcon={<AccountCircleIcon />}
                        >
                          My Account
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button
                          onClick={handleClick}
                          variant="outlined"
                          startIcon={<SettingsIcon />}
                        >
                          Settings
                        </Button>
                      </Link>
                      <Button
                        onClick={onClickLogout}
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                      >
                        Exit
                      </Button>
                    </Box>
                  ) : null}
                </Box>
              </ClickAwayListener>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
