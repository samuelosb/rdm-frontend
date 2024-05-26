"use client";
import {Col, Container, Row} from 'react-bootstrap';
import './../globals.css';
import {useRouter} from 'next/navigation';
import {useTranslation} from 'react-i18next';

/**
 * @module Footer
 *
 * This module defines the Footer component for the application.
 * It provides links to legal information and about pages.
 */

export default function Footer() {
    const {t} = useTranslation("global");
    const router = useRouter();

    return (
        <Container fluid className="mt-4 mb-4">
            <Row className="justify-content-center">
                <Col className="text-center">
                    {t("footer.rights")} {/* Display rights information */}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="text-center" md={1}>
                    <a href="#" onClick={() => router.push('/about/legal')}>{t("footer.legal")}</a> {/* Legal link */}
                </Col>
                <Col className="text-center" md={2}>
                    <a href="#" onClick={() => router.push('/about')}>{t("footer.about")}</a> {/* About link */}
                </Col>
            </Row>
        </Container>
    );
}
