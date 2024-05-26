'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from "../page.module.css";
import Row from 'react-bootstrap/Row';
import { Card, Container } from 'react-bootstrap';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function UserConfig() {
    const { t } = useTranslation("global");

    const [validated, setValidated] = useState(false);

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
            <p><b>{t("userConfig.title")}</b></p>
            <Link href="/userConfig/changeData">
                <Card className="text-center">
                    <Card.Header>{t("userConfig.personalDataHeader")}</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {t("userConfig.personalDataDescription")}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
            <br />
            <Link href="/userConfig/changePass">
                <Card className="text-center">
                    <Card.Header>{t("userConfig.changePasswordHeader")}</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {t("userConfig.changePasswordDescription")}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </Container>
    );
}
