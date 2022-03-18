import type { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { isAuthenticated, signIn } = useAuthContext();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const data = {
			email,
			password,
		};

		await signIn(data);
	}

	return (
		<form onSubmit={(e) => handleSubmit(e)} className={styles.container}>
			<input
				type='email'
				value={email}
				name='email'
				onChange={({ target: { value } }) => setEmail(value)}
			/>
			<input
				type='password'
				value={password}
				name='password'
				onChange={({ target: { value } }) => setPassword(value)}
			/>
			<button type='submit'>Entrar</button>
		</form>
	);
};

export default Home;
