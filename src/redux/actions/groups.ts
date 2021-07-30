import { toFormData } from './../../utils/utils';
import { Methods, Request } from '../../utils/Wrapper';

import * as types from '../types/groups';
import { IObject } from '../../interfaces/Common';
import { showMessage } from './message';
import i18n from '../../i18n';
import store, { RootState } from '..';

export const GROUPS_LIMIT = 10;

export const resetGroups = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_GROUPS });
};

export const resetSingleGroup = () => (dispatch: Function) => {
  dispatch({ type: types.RESET_SINGLE_GROUP });
};

export const getGroups =
  (sports: string[] = []) =>
  async (dispatch: Function, getState: () => typeof RootState) => {
    dispatch({ type: types.GET_GROUPS_ATTEMPT });

    const { offset } = getState().groups;

    let requestParams = {
      method: Methods.GET,
      endpoint: `/groups?offset=${offset}&limit=${GROUPS_LIMIT}${sports.map((v) => '&sports[]=' + v).join('')}`,
    };

    try {
      let res = await Request(dispatch, requestParams);
      if (sports.length) await dispatch(resetGroups());
      dispatch({
        type: types.GET_GROUPS_SUCCESS,
        payload: {
          data: res.data.data,
          groupsExhausted: res.data.data.length < GROUPS_LIMIT,
        },
      });
    } catch (error) {
      dispatch({
        type: types.GET_GROUPS_FAIL,
      });
    }
  };

export const getGroup = async (_id: string) => {
  let requestParams = {
    method: Methods.GET,
    endpoint: `/groups/${_id}`,
  };
  try {
    let { response } = await Request(store.dispatch, requestParams);

    return response.data.data;
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
  }
};

export const createGroup = async ({ title, sport }: { title: string; sport: string }) => {
  let requestParams = {
    method: Methods.POST,
    endpoint: `/groups`,
    body: { title, sport },
  };
  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
  }
};

export const deleteGroup = async (id: string) => {
  let requestParams = {
    method: Methods.DELETE,
    endpoint: `/groups/${id}`,
  };
  try {
    await Request(store.dispatch, requestParams);
  } catch (error) {
    showMessage(i18n.t('common.error'), error?.message, 'error');
  }
};
