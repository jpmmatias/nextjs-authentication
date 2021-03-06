import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

type FailedRequestQueue = {
	onSuccess: (token: string) => void;
	onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedRequestsQueue = Array<FailedRequestQueue>();

export function setupApiClient(ctx = undefined) {
	let cookies = parseCookies(ctx);

	const api = axios.create({
		baseURL: 'http://localhost:3333',
		headers: {
			Authorization: `Bearer ${cookies['next-auth.token']}`,
		},
	});

	api.interceptors.response.use(
		(response) => {
			return response;
		},
		(error: AxiosError) => {
			if (error.response?.status === 401) {
				if (error.response.data?.code === 'token.expired') {
					cookies = parseCookies();

					const { 'nextauth.refreshToken': refreshToken } = cookies;
					const originalConfig = error.config;

					if (!isRefreshing) {
						isRefreshing = true;

						api
							.post('/refresh', {
								refreshToken,
							})
							.then((response) => {
								const { token } = response.data;

								setCookie(ctx, 'next-auth.token', token, {
									maxAge: 60 * 60 * 24 * 30, // 30 days
									path: '/',
								});

								setCookie(
									ctx,
									'nextauth.refreshToken',
									response.data.refreshToken,
									{
										maxAge: 60 * 60 * 24 * 30, // 30 days
										path: '/',
									}
								);

								api.defaults.headers.common[
									'Authorization'
								] = `Bearer ${token}`;

								failedRequestsQueue.forEach((request) =>
									request.onSuccess(token)
								);
								failedRequestsQueue = [];
							})
							.catch((err) => {
								failedRequestsQueue.forEach((request) =>
									request.onFailure(err)
								);
								failedRequestsQueue = [];
							})
							.finally(() => {
								isRefreshing = false;
							});
					}

					return new Promise((resolve, reject) => {
						failedRequestsQueue.push({
							onSuccess: (token: string) => {
								api.defaults.headers.common[
									'Authorization'
								] = `Bearer ${token}`;

								resolve(api(originalConfig));
							},
							onFailure: (err: AxiosError) => {
								reject(err);
							},
						});
					});
				} else {
					if (typeof window !== 'undefined') {
						signOut();
					}
				}
			}

			return Promise.reject(error);
		}
	);
	return api;
}
