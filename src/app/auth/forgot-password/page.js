'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';
import styles from "../../page.module.css";
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Page() {
    const { t } = useTranslation("global");
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleEmailChange = (ev) => {
        setEmail(ev.target.value);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setSubmitted(false);
        setError('');

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_AUTH_URL + "/request-password-reset", { email });
            if (response.status === 200) {
                setSubmitted(true);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container className={styles.main}>
            <p><b>{t("resetPassword.title")}</b></p>
            <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="emailCtrl">
                        <Form.Label>{t("resetPassword.email")}</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="example@domain.com"
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                            onChange={handleEmailChange}
                        />
                        <Form.Control.Feedback />
                    </Form.Group>
                </Row>
                <Container fluid>
                    <Button className="me-3" variant="secondary" href="/auth/login">{t("resetPassword.back")}</Button>
                    <Button variant="dark" type="submit">{t("resetPassword.submit")}</Button>
                </Container>
            </Form>
            {submitted && (
                <div className="alert alert-success mt-3">
                    {t("resetPassword.successMessage")}
                </div>
            )}
            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}
        </Container>
    );
}
