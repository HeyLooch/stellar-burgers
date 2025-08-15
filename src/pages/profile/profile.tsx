import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUser,
  isLoadingUser,
  updateUser
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const loading = useSelector(isLoadingUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user?.name || '',
        email: user?.email || ''
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
      <Outlet />
    </>
  );
};
