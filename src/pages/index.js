import Head from 'next/head';
import Contact from './contact';

export default function Home() {
	return (
		<div>
			<Head>
				<title>TEST FRONTEND BTPN</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Contact />
		</div>
	);
}