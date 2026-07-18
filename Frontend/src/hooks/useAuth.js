import useAuthStore from '../contexts/authStore';
import { authService } from '../services/authService';

export function useAuth() {
  const store = useAuthStore();

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user, accessToken } = res.data.data;
    store.setAuth(user, accessToken);
    return res;
  };

  const logout = () => {
    store.logout();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    token: store.token,
    login,
    logout,
    updateUser: store.updateUser
  };
}
