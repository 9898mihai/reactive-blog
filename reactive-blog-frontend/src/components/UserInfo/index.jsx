import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './UserInfo.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';

export const UserInfo = ({ _id, avatarUrl, fullName, additionalText }) => {
  const isAuth = useSelector(selectIsAuth);

  return (
    <div className={styles.root}>
      {isAuth ? (
        <Link to={`/profile/${_id}`}>
          <img
            className={styles.avatar}
            src={
              avatarUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:4444'}${avatarUrl}` : '/noavatar.png'
            }
            alt={fullName}
          />
        </Link>
      ) : (
        <img
          className={styles.avatar}
          src={
            avatarUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:4444'}${avatarUrl}` : '/noavatar.png'
          }
          alt={fullName}
        />
      )}
      <div className={styles.userDetails}>
        {isAuth ? (
          <Link to={`/profile/${_id}`}>
            <span className={styles.userName}>{fullName}</span>
          </Link>
        ) : (
          <span className={styles.userName}>{fullName}</span>
        )}
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
