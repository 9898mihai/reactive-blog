import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { selectIsAuth } from '../redux/slices/auth';

export const FullPost = () => {
  const [data, setData] = useState();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Error while fetching article');
      });
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={new Date(data.createdAt).toLocaleDateString()}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={data.comments}
        user={data.comments.user}
        isLoading={isLoading}
      >
        {isAuth && <Index />}
      </CommentsBlock>
    </>
  );
};
