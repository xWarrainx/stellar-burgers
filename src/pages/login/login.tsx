import { FC, SyntheticEvent, useState, useCallback } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setErrorText('');

      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
          navigate('/profile');
        })
        .catch((err) => {
          setErrorText(err.message || 'Ошибка входа');
        });
    },
    [email, password, dispatch, navigate]
  );

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
