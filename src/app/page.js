"use client";
import {Suspense} from 'react';
import Home from './home/page.js';
import dotenv from 'dotenv';

dotenv.config();

export default function App() {
    return (
        <Suspense>
            <Home/>
        </Suspense>
    );
}
