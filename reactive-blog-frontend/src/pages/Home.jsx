import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {
  fetchPosts,
  fetchBestPosts,
  fetchPostsByTag,
  fetchTags,
  fetchComments,
} from '../redux/slices/posts';

export const Home = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, bestPosts, postsByTag, tags, comments } = useSelector(
    (state) => state.posts
  );
  const [tab, setTab] = useState(0);
  const hasTag = Boolean(id);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchBestPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostsByTag(id));
    }
  }, [id, dispatch]);

  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <>
      {hasTag ? (
        <Tab label={`#${id}`} />
      ) : (
        <Tabs style={{ marginBottom: 15 }} value={tab} onChange={handleChange}>
          <Tab label="New" />
          <Tab label="Popular" />
        </Tabs>
      )}

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(hasTag
            ? postsByTag?.items
            : tab === 0
            ? posts?.items
            : bestPosts?.items
          ).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
                }
                user={obj.user}
                createdAt={new Date(obj.createdAt).toLocaleDateString()}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items} isLoading={isCommentsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
