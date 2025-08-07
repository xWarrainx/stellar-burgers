import userReducer, {
  loginUser,
  checkUserAuth,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logout
} from './userSlice';
import { TUser } from '@utils-types';

// Мокируем API с полными типами ответов
jest.mock(
  '@api',
  () => ({
    loginUserApi: jest.fn().mockResolvedValue({
      success: true,
      user: { email: 'test@example.com', name: 'Test User' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }),
    registerUserApi: jest.fn().mockResolvedValue({
      success: true,
      user: { email: 'test@example.com', name: 'Test User' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }),
    getUserApi: jest.fn().mockResolvedValue({
      success: true,
      user: { email: 'test@example.com', name: 'Test User' }
    }),
    logoutApi: jest.fn().mockResolvedValue({
      success: true,
      message: 'Successfully logged out'
    }),
    updateUserApi: jest.fn().mockResolvedValue({
      success: true,
      user: { email: 'updated@example.com', name: 'Updated User' }
    }),
    forgotPasswordApi: jest.fn().mockResolvedValue({
      success: true,
      message: 'Reset email sent'
    }),
    resetPasswordApi: jest.fn().mockResolvedValue({
      success: true,
      message: 'Password successfully reset'
    })
  }),
  { virtual: true }
);

// Мокируем cookie-утилиты
jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('Обработка синхронных экшенов', () => {
    it('Обрабатка logout', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };
      const state = userReducer(stateWithUser, logout());
      expect(state).toEqual({
        ...initialState,
        user: null,
        isAuthChecked: true
      });
    });
  });

  describe('Обработка асинхронных экшенов', () => {
    describe('loginUser', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(
          initialState,
          loginUser.pending('', { email: '', password: '' })
        );
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('Обрабатка fulfilled', () => {
        const state = userReducer(
          { ...initialState, loading: true },
          loginUser.fulfilled(mockUser, '', { email: '', password: '' })
        );
        expect(state).toEqual({
          ...initialState,
          user: mockUser,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const error = 'Login failed';
        const state = userReducer(
          { ...initialState, loading: true },
          loginUser.rejected(
            new Error(error),
            '',
            { email: '', password: '' },
            error
          )
        );
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error
        });
      });
    });

    describe('Обрабатка checkUserAuth', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(initialState, checkUserAuth.pending(''));
        expect(state).toEqual({
          ...initialState,
          loading: true
        });
      });

      it('Обрабатка fulfilled', () => {
        const state = userReducer(
          { ...initialState, loading: true },
          checkUserAuth.fulfilled(mockUser, '')
        );
        expect(state).toEqual({
          ...initialState,
          user: mockUser,
          isAuthChecked: true,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const state = userReducer(
          { ...initialState, loading: true },
          checkUserAuth.rejected(new Error('Auth failed'), '')
        );
        expect(state).toEqual({
          ...initialState,
          user: null,
          isAuthChecked: true,
          loading: false
        });
      });
    });

    describe('Обрабатка logoutUser', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(initialState, logoutUser.pending(''));
        expect(state).toEqual({
          ...initialState,
          loading: true
        });
      });

      it('Обрабатка fulfilled', () => {
        const successResponse = { success: true, message: 'Logged out' };
        const state = userReducer(
          { ...initialState, loading: true, user: mockUser },
          logoutUser.fulfilled(successResponse, '')
        );
        expect(state).toEqual({
          ...initialState,
          user: null,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const error = 'Logout failed';
        const state = userReducer(
          { ...initialState, loading: true },
          logoutUser.rejected(new Error(error), '', undefined, error)
        );
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error
        });
      });
    });

    describe('Обрабатка updateUser', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(
          initialState,
          updateUser.pending('', { email: '', name: '' })
        );
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('Обрабатка fulfilled', () => {
        const updatedUser = { ...mockUser, name: 'Updated Name' };
        const state = userReducer(
          { ...initialState, loading: true },
          updateUser.fulfilled(updatedUser, '', { email: '', name: '' })
        );
        expect(state).toEqual({
          ...initialState,
          user: updatedUser,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const error = 'Update failed';
        const state = userReducer(
          { ...initialState, loading: true },
          updateUser.rejected(
            new Error(error),
            '',
            { email: '', name: '' },
            error
          )
        );
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error
        });
      });
    });

    describe('Обрабатка forgotPassword', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(
          initialState,
          forgotPassword.pending('', 'test@example.com')
        );
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('Обрабатка fulfilled', () => {
        const successResponse = { success: true, message: 'Email sent' };
        const state = userReducer(
          { ...initialState, loading: true },
          forgotPassword.fulfilled(successResponse, '', 'test@example.com')
        );
        expect(state).toEqual({
          ...initialState,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const error = 'Email send failed';
        const state = userReducer(
          { ...initialState, loading: true },
          forgotPassword.rejected(
            new Error(error),
            '',
            'test@example.com',
            error
          )
        );
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error
        });
      });
    });

    describe('Обрабатка resetPassword', () => {
      it('Обрабатка pending', () => {
        const state = userReducer(
          initialState,
          resetPassword.pending('', { password: 'newpass', token: 'token' })
        );
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null
        });
      });

      it('Обрабатка fulfilled', () => {
        const successResponse = { success: true, message: 'Password reset' };
        const state = userReducer(
          { ...initialState, loading: true },
          resetPassword.fulfilled(successResponse, '', {
            password: 'newpass',
            token: 'token'
          })
        );
        expect(state).toEqual({
          ...initialState,
          loading: false
        });
      });

      it('Обрабатка rejected', () => {
        const error = 'Reset failed';
        const state = userReducer(
          { ...initialState, loading: true },
          resetPassword.rejected(
            new Error(error),
            '',
            { password: 'newpass', token: 'token' },
            error
          )
        );
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error: error
        });
      });
    });
  });
});
