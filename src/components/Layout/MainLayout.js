import React from 'react';
import Header from '../General/Header';
import Footer from '../General/Footer';

const MainLayout = ({ children }) => (
	<>
		<div className="flex min-h-screen flex-col justify-between">
			<Header />
			<main className="container m-auto mt-4 xl:px-14 md:px-12 px-8">
				{children}
			</main>
			<Footer />
		</div>
	</>
);
export default MainLayout;
