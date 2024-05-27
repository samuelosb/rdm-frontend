'use client'
import { useState } from 'react';
import { Button, Col, Form, Row, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import styles from "../../page.module.css";

/**
 * @module UserConfig
 *
 * This module defines the UserConfig component, which provides a form for users to update their personal information,
 * such as name and email. It uses Bootstrap for styling and layout and includes form validation.
 */

export default function UserConfig() {
    const { t } = useTranslation("global");
    const router = useRouter();
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * Handles form submission, validating the form fields before allowing submission.
     * @param {Object} ev - The form submission event.
     */
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const form = ev.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(false);
            return;
        }

        setValidated(true);

        try {
            const token = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
            const decodedToken = jwt.decode(token);
            const userId = decodedToken ? decodedToken.id : null;

            if (!userId) {
                setErrorMessage(t("changeUserData.invalidToken"));
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/update-details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    newEmail: email,
                    newUsername: name
                })
            });

            if (response.ok) {
                setSuccessMessage(t("changeUserData.successMessage"));
                setErrorMessage('');
            } else {
                const result = await response.json();
                setErrorMessage(result.message || t("changeUserData.errorMessage"));
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            setErrorMessage(t("changeUserData.errorMessage"));
            setSuccessMessage('');
        }
    };

    return (
        <Container className={styles.main}>
            <p><b>{t("changeUserData.title")}</b></p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="nameCtrl">
                        <Form.Label>{t("changeUserData.name")}</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("changeUserData.nameRequired")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="emailCtrl">
                        <Form.Label>{t("changeUserData.email")}</Form.Label>
                        <Form.Control
                            required
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                            type="email"
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("changeUserData.emailRequired")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {errorMessage && (
                    <Row className="mb-3">
                        <Col>
                            <p className="text-danger">{errorMessage}</p>
                        </Col>
                    </Row>
                )}
                {successMessage && (
                    <Row className="mb-3">
                        <Col>
                            <p className="text-success">{successMessage}</p>
                        </Col>
                    </Row>
                )}
                <Container className="d-flex justify-content-between">
                    <Button className="me-3" variant="secondary" onClick={() => router.push('/userConfig')}>{t("changeUserData.back")}</Button>
                    <Button variant="dark" type="submit"><img src="/check-square.svg" alt="Save Icon"/> {t("changeUserData.save")}</Button>
                </Container>
            </Form>
        </Container>
    );
}
