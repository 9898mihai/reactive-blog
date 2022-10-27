import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import RocketIcon from '@mui/icons-material/Rocket';

import styles from './Header.module.scss';
import { selectIsAuth, logout } from '../../redux/slices/auth';
import axios from '../../axios';

export const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [authId, setAuthId] = useState('');

  useEffect(() => {
    if (isAuth) {
      axios
        .get('/auth/me')
        .then(({ data }) => {
          setAvatarUrl(data.avatarUrl);
          setFullName(data.fullName);
          setAuthId(data._id);
        })
        .catch((err) => {
          console.warn(err);
          alert('Can not get user data');
        });
    }
  }, [isAuth]);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <AppBar className={styles.root} position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RocketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MERN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {isAuth ? (
                <div className={styles.hamburger}>
                  <Link to="/add-post">
                    <MenuItem onClick={handleCloseNavMenu}>
                      Write an article
                    </MenuItem>
                  </Link>
                </div>
              ) : (
                <div className={styles.hamburger}>
                  <Link to="/login">
                    <MenuItem onClick={handleCloseNavMenu}>Login</MenuItem>
                  </Link>
                  <Link to="/register">
                    <MenuItem onClick={handleCloseNavMenu}>
                      Create account
                    </MenuItem>
                  </Link>
                </div>
              )}
            </Menu>
          </Box>
          <RocketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MERN
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: isAuth ? 'flex-start' : 'flex-end',
            }}
          >
            {isAuth ? (
              <Button onClick={handleCloseNavMenu} sx={{ my: 2 }}>
                <Link to="/add-post">Write an article</Link>
              </Button>
            ) : (
              <>
                <Button onClick={handleCloseNavMenu} sx={{ my: 2 }}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button onClick={handleCloseNavMenu} sx={{ my: 2 }}>
                  <Link to="/register">Create account</Link>
                </Button>
              </>
            )}
          </Box>

          {isAuth && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={fullName}
                    src={avatarUrl ? `http://localhost:4444${avatarUrl}` : ''}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                className={styles.profileItems}
              >
                <Link to={`/profile/${authId}`}>
                  <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                </Link>
                <Link to="/account">
                  <MenuItem onClick={handleCloseUserMenu}>Account</MenuItem>
                </Link>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ margin: '0 10px' }} onClick={onClickLogout}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
