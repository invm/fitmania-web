import { Request, Methods } from '../../utils/Wrapper';
import * as types from '../types/user';
import { Dispatch } from 'react';
import i18n from '../../i18n';
import IUser from '../../interfaces/User';
import { showMessage } from './message';
const { REACT_APP_ENV } = process.env;

export const changeTheme = () => (dispatch: Function) => {
  return dispatch({
    type: types.THEME_CHANGE,
  });
};

export const verifySession = () => async (dispatch: Function) => {
  try {
    let requestParams = {
      method: Methods.GET,
      endpoint: `/auth/`,
    };

    await Request(dispatch, requestParams);
    dispatch({ type: types.AUTHENTICATE, payload: true });
    dispatch(getProfile());
  } catch (error) {
    dispatch({ type: types.AUTHENTICATE, payload: false });
  }
};

export const register =
  ({ email, name, lastname }: { email: string; name?: string | undefined; lastname?: string | undefined }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/auth/register`,
      body: {
        email,
        name,
        lastname,
      },
    };

    await Request(dispatch, requestParams);
  };

export const login =
  ({ email }: { email: string }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.POST,
      endpoint: `/auth/otp`,
      body: {
        email: email,
      },
    };

    let res = await Request(dispatch, requestParams);

    return (REACT_APP_ENV !== 'production' && res?.data?.data?.otp) ?? null;
  };

export const verifyOTP = (email: string, otp: string) => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/auth/login`,
    body: {
      email,
      otp,
    },
  };

  try {
    await Request(dispatch, requestParams);
    dispatch(verifySession());
  } catch (error) {
    showMessage(i18n.t('common.error'), error.message, 'error');
  }
};

export const logout = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/auth/logout`,
  };
  dispatch({ type: types.LOGOUT });

  await Request(dispatch, requestParams);
};

export const deleteProfile = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/profile`,
  };

  await Request(dispatch, requestParams);

  dispatch({ type: types.LOGOUT });
};

export const getProfile = () => async (dispatch: Function) => {
  dispatch({ type: types.USER_LOADING });
  let requestParams = {
    method: Methods.GET,
    endpoint: `/user/`,
  };

  try {
    let result = await Request(dispatch, requestParams);

    const loadedData: IUser = {
      ...result.data.data,
    };

    dispatch({
      type: types.GET_PROFILE,
      payload: {
        ...loadedData,
        profileLoaded: true,
      },
    });
  } catch (error) {
    if (error?.code === 'A34') {
      // in case the response is 'profile not created' navigate to onboarding screen, then he will be redirected to create profile screen, else navigate to home
      dispatch({
        type: types.GET_PROFILE,
        payload: {
          profileLoaded: true,
        },
      });
    }
  }
};

export const createProfile =
  ({ name, lastname }: { name: string; lastname: string }) =>
  async (dispatch: Function) => {
    let requestParams = {
      method: Methods.PATCH,
      endpoint: `/user`,
      body: {
        name,
        lastname,
      },
    };

    await Request(dispatch, requestParams);

    await dispatch(getProfile());
  };

export const updateProfile =
  (
    profileData: object,
    options: {
      deleteProfilePicture?: boolean;
      updateProfilePicture?: File;
    }
  ) =>
  async (dispatch: Function) => {
    if (options?.deleteProfilePicture) {
      await dispatch(deleteProfilePicture());
    }

    if (options?.updateProfilePicture) {
      await dispatch(uploadProfilePicture(options.updateProfilePicture));
    }

    if (profileData) {
      let requestParams = {
        method: Methods.PATCH,
        endpoint: `/user`,
        body: {
          ...profileData,
        },
      };

      await Request(dispatch, requestParams);
    }

    await dispatch(getProfile());
  };

export const uploadProfilePicture = (file: File) => async (dispatch: Function) => {
  let formData = new FormData();

  formData.append('profilePicture', file);

  let requestParams = {
    method: Methods.PUT,
    endpoint: `/profile/picture`,
    body: formData,
  };

  await Request(dispatch, requestParams);
};

export const deleteProfilePicture = () => async (dispatch: Function) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/profile/picture`,
  };

  await Request(dispatch, requestParams);
};

/**
 * This function sends an OTP to clients if a email is provided, if an OTP is provided, it attempts to log them in.
 *
 * @param action - Expected to be either login or register. If OTP is provided, it is assumed to be login.
 * @param email - Client email number
 * @param setLoading
 * @param activateModal
 * @param navigation
 * @param dispatch
 * @param OTP
 */
export const sendOTPorLogin = async ({
  sendEmail,
  sendCreds,
  data,
  cb,
  dispatch,
  otp,
}: {
  sendEmail?: ({
    email,
    name,
    lastname,
  }: {
    email: string;
    name?: string;
    lastname?: string;
  }) => (dispatch: Function) => Promise<void>;
  sendCreds?: (email: string, otp: string) => (dispatch: Function) => Promise<void>;
  data: { email: string; name?: string; lastname?: string };
  cb: (success: boolean) => void;
  dispatch: Dispatch<any>;
  otp?: string;
}) => {
  try {
    if (otp && sendCreds) {
      await dispatch(sendCreds(data.email, otp)); // Assumed to be login

      await dispatch(getProfile()); // Profile is fetched in order to check if the user already created a profile, if so, skip the onboarding and profile creation
    } else if (sendEmail) {
      let otp = await dispatch(sendEmail(data));
      cb(true);
      return otp;
    }
  } catch (err) {
    // If connection has been aborted then there is no point in doing anything as the client is sent to the server dead screen
    if (!err.data?.connectionAborted) {
      if (err.display) {
        showMessage(i18n.t('common.error'), err.message, 'error');
      }
      cb(false);
    }

    return err;
  }
};
