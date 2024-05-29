/**
 * @module UpperMenu
 *
 * This module defines the UpperMenu component, which is the main navigation bar for the application.
 * It handles user authentication state, language selection, and search functionality.
 * The navigation bar adjusts its content based on the user's authentication status.
 */

'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSliders, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Flag from 'react-world-flags';
import Link from 'next/link';
import './UpperMenu.css';
import i18next from 'i18next';
import {deleteCookie, getCookie, hasCookie} from 'cookies-next';
import jwt from 'jsonwebtoken';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-bootstrap';
import {useAuth} from '../../AuthContext';

/**
 * UpperMenu component defines the main navigation bar for the application.
 * Handles user authentication state, language selection, and search functionality.
 * Adjusts its content based on the user's authentication status.
 */
export default function UpperMenu() {
    const router = useRouter();
    const {isAuthenticated, isAdmin, user, setIsAuthenticated, setIsAdmin, setUser} = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [lang, setLang] = useState("ESP");
    const {t} = useTranslation("global");

    // Effect to check and set authentication state based on the access token cookie
    useEffect(() => {
        if (hasCookie("accessToken")) {
            const user = jwt.decode(getCookie("accessToken"));
            if (user.role === "Admin") {
                setIsAdmin(true);
            } else if (user.role === "Basic") {
                setIsAuthenticated(true);
            }
            setUser(user);
        }
    }, [setIsAdmin, setIsAuthenticated, setUser]);

    // Function to change language to Spanish
    const changeLanguageEs = () => {
        i18next.changeLanguage("es");
        setLang("ESP");
    };

    // Function to change language to English
    const changeLanguageEn = () => {
        i18next.changeLanguage("en");
        setLang("US");
    };

    // Handle search form submission
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        router.push(`/search/results?query=${encodeURIComponent(searchQuery)}`);
    };

    // Handle search input change
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle user logout
    const handleLogoutClick = () => {
        deleteCookie("accessToken");
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        window.location.reload()
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand className="clickable-brand d-flex align-items-center">
                        <Image
                            src="/logo.png"
                            width="70"
                            height="65"
                            className="d-inline-block align-center logo-img"
                            alt="Recetas del mundo"
                        />
                        <span className="ml-2 brand-text">Recetas del mundo</span>
                    </Navbar.Brand>
                </Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="mx-2 align-items-center">
                        <Navbar.Text className="mx-2 align-items-center">
                            <Link className="mx-5" href="/forum">{t("upperMenu.forum")}</Link>
                        </Navbar.Text>
                    </Nav>

                    <Nav className="mx-2 align-items-center">
                        <form className="search-form" onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                className="form-control"
                                placeholder={t("upperMenu.search-placeholder")}
                                onChange={handleInputChange}
                                value={searchQuery}
                            />
                            <div className="icons-container">
                                <Link href="/search" passHref>
                                    <FontAwesomeIcon
                                        icon={faSliders}
                                        className="search-icon advanced-search"
                                        titleId="Realice una búsqueda más precisa aquí"
                                    />
                                </Link>
                                <button type="submit" style={{border: 'none', background: 'none'}}>
                                    <FontAwesomeIcon
                                        icon={faMagnifyingGlass}
                                        className="search-icon"
                                    />
                                </button>
                            </div>
                        </form>
                    </Nav>

                    <Nav className="mx-2 align-items-center">
                        <NavDropdown id="nav-dropdown-dark-example" title={<Flag code={lang} width="34"/>}>
                            <NavDropdown.Item onClick={changeLanguageEs}>
                                <Flag style={{opacity: lang === 'ESP' ? 0.5 : 1}}
                                      code={'ESP'} width="34"/>
                                &nbsp;Español
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={changeLanguageEn}>
                                <Flag style={{opacity: lang === 'US' ? 0.5 : 1}}
                                      code={'US'} width="34"/>
                                &nbsp;English
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    {(isAuthenticated || isAdmin) && (
                        <>
                            <Nav className="mx-2">
                                <Navbar.Text className="mx-auto">
                                    <Link href="/favorites">{t("upperMenu.favs")}</Link>
                                </Navbar.Text>
                            </Nav>
                            <Nav className="mx-2">
                                <Navbar.Text className="mx-auto">
                                    <Link href="/weekPlan">{t("upperMenu.weekPlan")}</Link>
                                </Navbar.Text>
                            </Nav>
                            <Nav className="mx-2">
                                <Navbar.Text className="mx-auto">
                                    <Link href="/userConfig">{user?.username}</Link>
                                </Navbar.Text>
                            </Nav>
                            {isAdmin && (
                                <Nav className="mx-2">
                                    <Navbar.Text className="mx-auto">
                                        <Link href="/admin">{t("upperMenu.admin")}</Link>
                                    </Navbar.Text>
                                </Nav>
                            )}
                            <Nav className="mx-2">
                                <Navbar.Text className="mx-auto">
                                    <img onClick={handleLogoutClick} src="/logout.png" width="25" height="24"
                                         className="d-inline-block align-center" alt={t("upperMenu.logout")}
                                         style={{cursor: 'pointer'}}/>
                                </Navbar.Text>
                            </Nav>
                        </>
                    )}
                    {!isAuthenticated && !isAdmin && (
                        <>
                            <Nav className="mx-4">
                                <Navbar.Text className="mx-auto">
                                    <Link href="/auth/login">{t("upperMenu.login")}</Link>
                                </Navbar.Text>
                            </Nav>
                            <Nav>
                                <Navbar.Text className="mx-auto">
                                    <Link href="/auth/register">{t("upperMenu.register")}</Link>
                                </Navbar.Text>
                            </Nav>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
