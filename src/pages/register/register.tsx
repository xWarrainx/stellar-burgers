import { FC, SyntheticEvent, useState, useCallback } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setErrorText('');

      dispatch(registerUser({ email, name: userName, password }))
        .unwrap()
        .then(() => {
          navigate('/login');
        })
        .catch((err) => {
          setErrorText(err.message || 'Ошибка регистрации');
        });
    },
    [email, userName, password, dispatch, navigate]
  );

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
