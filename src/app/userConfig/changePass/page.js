'use client'
import {useState} from 'react';
import {Button, Col, Form, Row, Container} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import styles from "../../page.module.css";

/**
 * @module ChangePassword
 *
 * This module defines the ChangePassword component, which provides a form for users to change their password.
 * It includes form validation to ensure that the new password meets specific criteria and that the password confirmation matches.
 * The component uses Bootstrap for styling and layout.
 */

export default function ChangePassword() {
    const {t} = useTranslation("global");

    // State variables for form validation and password management
    const [validated, setValidated] = useState(false);
    const [pass, setPassword] = useState('');
    const [confirmPass, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    /**
     * Handles form submission, validating the form fields before allowing submission.
     * @param {Object} ev - The form submission event.
     */
    const handleSubmit = (ev) => {
        const form = ev.currentTarget;
        if (form.checkValidity() === false || !passwordsMatch) {
            ev.preventDefault();
            ev.stopPropagation();
            setValidated(false);
        } else {
            setValidated(true);
        }
        console.log(validated);
    };

    /**
     * Handles changes to the new password field and updates the password state.
     * @param {Object} ev - The input change event.
     */
    const handlePassChange = (ev) => {
        setPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === confirmPass);
    };

    /**
     * Handles changes to the confirm new password field and updates the confirm password state.
     * @param {Object} ev - The input change event.
     */
    const handleConfirmPassChange = (ev) => {
        setConfirmPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === pass);
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
                        />
                        <Form.Control.Feedback/>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="newPassCtrl">
                        <Form.Label>{t("changePassword.newPass")}</Form.Label>
                        <Form.Control
                            pattern="^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$"
                            type="password" placeholder={t("changePassword.newPassPlaceholder")}
                            onChange={handlePassChange} required/>
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
                            onChange={handleConfirmPassChange}
                            placeholder={t("changePassword.newPassPlaceholder")}
                            required/>
                        <Form.Control.Feedback type="invalid">
                            {t("changePassword.weakPass")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Container flex>
                    <Button className="me-3" variant="secondary" href="/userConfig">{t("changePassword.back")}</Button>
                    <Button variant="dark" type="submit"><img src="/check-square.svg"
                                                              alt="Save Icon"/> {t("changePassword.submit")}
                    </Button>
                </Container>
            </Form>
        </Container>
    );
}
