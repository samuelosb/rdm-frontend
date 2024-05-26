'use client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from "./../../page.module.css";
import { useTranslation } from 'react-i18next';

export default function Legal() {
    const { t } = useTranslation("global");

    return (
        <Container className={styles.main}>
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <h2>{t("legal.intro.heading")}</h2>
                    <p className="lead">
                        {t("legal.intro.description")}
                    </p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h4>{t("legal.privacyPolicy.heading")}</h4>
                    <p>
                        {t("legal.privacyPolicy.description")}
                    </p>
                </Col>
                <Col md={6}>
                    <h4>{t("legal.cookiePolicy.heading")}</h4>
                    <p>
                        {t("legal.cookiePolicy.description")}
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
