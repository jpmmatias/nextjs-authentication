import { createContext, useState, ReactNode, useContext } from 'react';

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
		console.log({ email, password });
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
