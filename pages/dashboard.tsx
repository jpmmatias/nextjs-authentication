import React, { useEffect } from 'react';
import Router from 'next/router';
import { useAuthContext } from '../contexts/AuthContext';
import { api } from '../services/apiClient';
import { onlyAuth } from '../utils/onlyAuth';
import { setupApiClient } from '../services/api';

type Props = {};

function Dashboard({}: Props) {
	const { user, isAuthenticated } = useAuthContext();

	useEffect(() => {
		api.get('/me').then((response) => console.log(response));
	}, []);

	return <h1>Olá Dashboard {user?.email}</h1>;
}

export default Dashboard;

export const getServerSideProps = onlyAuth(async (ctx) => {
	const apiClient = setupApiClient(ctx);
	const response = await apiClient.get('/me');
	return {
		props: {},
	};
});
