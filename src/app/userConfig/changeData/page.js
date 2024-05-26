'use client'
import {useState} from 'react';
import {Button, Col, Form, Row, Container} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import styles from "../../page.module.css";

/**
 * @module UserConfig
 *
 * This module defines the UserConfig component, which provides a form for users to update their personal information,
 * such as name and email. It uses Bootstrap for styling and layout and includes form validation.
 */

export default function UserConfig() {
    const {t} = useTranslation("global");
    const [validated, setValidated] = useState(false);

    /**
     * Handles form submission, validating the form fields before allowing submission.
     * @param {Object} ev - The form submission event.
     */
    const handleSubmit = (ev) => {
        const form = ev.currentTarget;
        if (form.checkValidity() === false) {
            ev.preventDefault();
            ev.stopPropagation();
            setValidated(false);
        }
        setValidated(true);
        console.log(validated);
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
                        />
                        <Form.Control.Feedback/>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="emailCtrl">
                        <Form.Label>{t("changeUserData.email")}</Form.Label>
                        <Form.Control
                            required
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                            type="text"
                            placeholder="example@domain.com"
                        />
                        <Form.Control.Feedback/>
                    </Form.Group>
                </Row>
                <Container fluid>
                    <Button className="me-3" variant="secondary" href="/userConfig">{t("changeUserData.back")}</Button>
                    <Button variant="dark" type="submit"><img src="/check-square.svg"
                                                              alt="Save Icon"/> {t("changeUserData.save")}</Button>
                </Container>
            </Form>
        </Container>
    );
}
