import { createContext, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

type SignInCredentials = {
	email: string;
	password: string;
};

type AuthContextData = {
	signIn(credentials: SignInCredentials): Promise<void>;
	isAuthenticated: boolean;
};

interface AuthProviderProps {
	children: ReactNode;
}
const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	async function signIn({ email, password }: SignInCredentials) {
		try {
			const response = await api.post('sessions', {
				email,
				password,
			});
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<AuthContext.Provider value={{ signIn, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const { isAuthenticated, signIn } = useContext(AuthContext);
	return { isAuthenticated, signIn };
}
