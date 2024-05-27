/**
 * @module UserConfig
 *
 * This module defines the UserConfig component, which provides an interface for users to view and update their personal information.
 * The component fetches the user's details such as username, email, and gender from the backend and displays them.
 * It also includes links to change personal data and password.
 */

'use client'
import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import styles from "../page.module.css";

export default function UserConfig() {
    const { t } = useTranslation("global");
    const [userData, setUserData] = useState({ username: '', email: '', gender: '' });
    const [error, setError] = useState(null);

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Retrieve the JWT token from cookies
                const token = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
                const decodedToken = jwt.decode(token);
                const userId = decodedToken ? decodedToken.id : null;

                if (!userId) {
                    setError(t("userConfig.invalidToken"));
                    return;
                }

                // Make a GET request to fetch user data by ID
                const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/getUserById?id=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    const result = await response.json();
                    setError(result.message || t("userConfig.errorMessage"));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(t("userConfig.errorMessage"));
            }
        };

        fetchUserData();
    }, [t]);

    return (
        <Container className={styles.main}>
            <p><b>{t("userConfig.title")}</b></p>
            {error && (
                <Row className="mb-3">
                    <Col>
                        <p className="text-danger">{error}</p>
                    </Col>
                </Row>
            )}
            {/* Display user information */}
            <Row className="mb-4">
                <Col>
                    <Card className="h-100">
                        <Card.Header>{t("userConfig.personalDataHeader")}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>{t("changeUserData.name")}: </strong>{userData.username}<br />
                                <strong>{t("changeUserData.email")}: </strong>{userData.email}<br />
                                <strong>{t("register.gender")}: </strong>{userData.gender}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Link to change personal data */}
            <Row className="mb-4">
                <Col>
                    <Link href="/userConfig/changeData" passHref>
                        <Card className="h-100 text-center">
                            <Card.Header>{t("userConfig.personalDataHeader")}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {t("userConfig.personalDataDescription")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            {/* Link to change password */}
            <Row className="mb-4">
                <Col>
                    <Link href="/userConfig/changePass" passHref>
                        <Card className="h-100 text-center">
                            <Card.Header>{t("userConfig.changePasswordHeader")}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {t("userConfig.changePasswordDescription")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}
