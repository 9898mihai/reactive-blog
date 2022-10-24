import { React, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Container from '@mui/material/Container';

import { Header } from './components';
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  MyAccount,
  Settings,
} from './pages';
import { fetchAuthMe } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/tags/:id" element={<Home />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
