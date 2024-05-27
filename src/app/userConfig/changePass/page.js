'use client'
import { useState } from 'react';
import { Button, Col, Form, Row, Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import styles from "../../page.module.css";

/**
 * @module ChangePassword
 *
 * This module defines the ChangePassword component, which provides a form for users to change their password.
 * It includes form validation to ensure that the new password meets specific criteria and that the password confirmation matches.
 * The component uses Bootstrap for styling and layout.
 */

export default function ChangePassword() {
    const { t } = useTranslation("global");
    const router = useRouter();

    // State variables for form validation and password management
    const [validated, setValidated] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
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

        if (form.checkValidity() === false || !passwordsMatch) {
            setValidated(true);
            return;
        }

        try {
            const token = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
            const decodedToken = jwt.decode(token);
            const userId = decodedToken ? decodedToken.id : null;

            if (!userId) {
                setErrorMessage(t("changePassword.invalidToken"));
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    oldPassword: currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                setSuccessMessage(t("changePassword.successMessage"));
                setErrorMessage('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setValidated(false);
            } else {
                const result = await response.json();
                setErrorMessage(result.message || t("changePassword.errorMessage"));
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage(t("changePassword.errorMessage"));
            setSuccessMessage('');
        }
    };

    /**
     * Handles changes to the current password field and updates the state.
     * @param {Object} ev - The input change event.
     */
    const handleCurrentPassChange = (ev) => {
        setCurrentPassword(ev.target.value);
    };

    /**
     * Handles changes to the new password field and updates the password state.
     * @param {Object} ev - The input change event.
     */
    const handleNewPassChange = (ev) => {
        setNewPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === confirmPassword);
    };

    /**
     * Handles changes to the confirm new password field and updates the confirm password state.
     * @param {Object} ev - The input change event.
     */
    const handleConfirmPassChange = (ev) => {
        setConfirmPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === newPassword);
    };

    return (
        <Container className={styles.main}>
            <p><b>{t("changePassword.title")}</b></p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="currentPassCtrl">
                        <Form.Label>{t("changePassword.currentPass")}</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder={t("changePassword.currentPassPlaceholder")}
                            value={currentPassword}
                            onChange={handleCurrentPassChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("changePassword.currentPassRequired")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="newPassCtrl">
                        <Form.Label>{t("changePassword.newPass")}</Form.Label>
                        <Form.Control
                            pattern="^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$"
                            type="password" placeholder={t("changePassword.newPassPlaceholder")}
                            value={newPassword}
                            onChange={handleNewPassChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("changePassword.weakPass")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="confirmNewPassCtrl">
                        <Form.Label>{t("changePassword.confirmNewPass")}</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPassChange}
                            placeholder={t("changePassword.newPassPlaceholder")}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("changePassword.weakPass")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {!passwordsMatch && (
                    <Row className="mb-3">
                        <Col>
                            <p className="text-danger">{t("changePassword.passwordsDontMatch")}</p>
                        </Col>
                    </Row>
                )}
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
                    <Button variant="dark" type="submit"><img src="/check-square.svg" alt="Save Icon"/> {t("changePassword.submit")}</Button>
                </Container>
            </Form>
        </Container>
    );
}
