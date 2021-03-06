import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

export function onlyAuth<P>(fn: GetServerSideProps<P>) {
	return async (
		ctx: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);
		if (cookies['next-auth.token']) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}
		return await fn(ctx);
	};
}

export const getServerSideProps = onlyAuth(async () => {
	return {
		props: {},
	};
});
