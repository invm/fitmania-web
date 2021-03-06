import api, { Res, RequestWrapperProps } from './Api';
import i18n from '../i18n';
import AppError from './AppError';
import { AUTHENTICATE } from '../redux/types/user';
import { showMessage } from '../redux/actions/message';

// All supported http methods of the system
export const Methods = {
	POST: 'post',
	PUT: 'put',
	PATCH: 'patch',
	GET: 'get',
	DELETE: 'delete'
};

/**
 * Centralizes the request sending and handles responses that are global.
 *
 * @param dispatch
 * @param requestParams
 */

export const Request = async (dispatch: Function, requestParams: RequestWrapperProps) => {
	let response: Res = await api(requestParams);

	if (process.env.REACT_APP_ENV === 'development') {
		console.log(`${requestParams.method.toUpperCase()} Request => ${requestParams.endpoint}`);

		if (response?.data) {
			console.log(response.data);
		}
	}

	if (response?.data?.msg) {
		showMessage(i18n.t('common.success'), response.data.msg, 'success');
	} else if (response?.data?.errors?.[0]?.msg) {
		throw new AppError({
			message: response?.data?.errors?.[0]?.msg,
			display: true,
			code: response.data.errors[0].errorCode
		});
	}

	if (response.success) {
		return {
			error: false,
			data: response.data,
			response
		};
	} else {
		switch (response.status) {
			case 401:
				dispatch({ type: AUTHENTICATE, payload: false });
				throw new AppError({ message: `No session`, display: false });
			case 400:
			case 422:
				throw new AppError({
					message: i18n.t(`errors.server_errors.${response.data.errors[0].errorCode}`, {
						defaultValue: i18n.t(`errors.server_errors.A0`)
					}),
					display: true,
					code: response.data.errors[0].errorCode
				});
			case 413:
				throw new AppError({
					message: i18n.t(`errors.server_errors.file_too_large`),
					display: true,
					code: response.data.errors[0].errorCode
				});
			case 999:
				throw new AppError({
					message: 'Connection to server failed',
					data: { connectionAborted: true }
				});
			default:
				throw new AppError({
					message: i18n.t(`errors.server_errors.A0`),
					data: {
						endpoint: response?.request?.responseURL,
						data: response.data,
						status: response.status
					},
					display: true
				});
		}
	}
};
