'use client';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from "./../page.module.css";
import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation("global");

    return (
        <Container className={styles.main}>
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <h2>{t("about.intro.heading")}</h2>
                    <p className="lead">
                        <strong>{t("about.intro.description")}</strong>
                    </p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <p>
                        {t("about.mission.part1")}
                    </p>
                    <p>
                        {t("about.mission.part2")}
                    </p>
                </Col>
                <Col md={6}>
                    <p>
                        {t("about.team.description")}
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-center mt-4 text-center">
                <Col>
                    <Image src="/logo.png" roundedCircle style={{ width: '50%', maxWidth: '100px', height: 'auto' }} />
                    <p className="mt-3">{t("about.teamLabel")}</p>
                </Col>
            </Row>
        </Container>
    );
}
