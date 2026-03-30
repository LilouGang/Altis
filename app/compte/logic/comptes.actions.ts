import { loginUser, registerUser } from '../data/comptes.service';

export const submitAuth = async (isLogin: boolean, email: string, password: string) => {
  if (isLogin) {
    return await loginUser(email, password);
  } else {
    return await registerUser(email, password);
  }
};