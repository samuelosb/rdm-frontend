import React, {Suspense} from 'react';
import {Inter} from 'next/font/google';
import './globals.css';
import UpperMenu from './components/UpperMenu';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../AuthContext';
import ClientI18nextProvider from './ClientI18nextProvider';

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'Recetas del mundo',
    description: 'Proyecto de la asignatura Sistemas y tecnologías Web',
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <AuthProvider>
            <ClientI18nextProvider>
                <Suspense>
                    <body className={inter.className}>
                    <UpperMenu/>
                    {children}
                    <Footer/>
                    </body>
                </Suspense>
            </ClientI18nextProvider>
        </AuthProvider>
        </html>
    );
}
