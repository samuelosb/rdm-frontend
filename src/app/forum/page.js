
/*  *****************************************************

    Page dedicated to the categories view of the forum.
    It presents a welcome text, and shows all the available forum categories.
    
    Accesible in /forum 

    ******************************************************/

"use client";
import styles from "../page.module.css";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import { CardBody } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";


export default function Forum() {

    const [t] = useTranslation("global");
    return (

        <Suspense fallback="Cargando...">
        <Container className={"my-4 px-5"}>
            <h6>{t("forum.header")}</h6>
            <br />


            <Card className="mb-0 px-12">
                <Card.Header>{t("forum.title")}</Card.Header>

                {/* Block for every category of the forum */}
                <Link href="forum/threads?category=general&id=1">
                    <div className="d-flex align-items-top">
                        <Image src="/f1logo.png" style={{
                            marginTop: '20px', width: '50px', height: '50px', marginLeft: '15px'
                        }} />
                        <Card.Body>
                            <Card.Title>
                                    {t("forum.genTitle")}
</Card.Title>
                            <Card.Text>
                                    {t("forum.genSubtitle")}
                            </Card.Text>
                        </Card.Body>
                    </div>
                </Link><hr />
                {/* ---------------------------------------------------*/}

                    <Link href="forum/threads?category=trucos&id=2">
                    <div className="d-flex align-items-top">
                        <Image src="/f2logo.png" style={{
                            marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                        }} />
                        <Card.Body>
                            <Card.Title>
                                    {t("forum.hckTitle")}</Card.Title>
                            <Card.Text>
                                    {t("forum.hckSubtitle")}
                            </Card.Text>
                        </Card.Body>

                    </div>
                </Link><hr />

                    <Link href="forum/threads?category=equipamiento&id=3">
                    <div className="d-flex align-items-top">
                        <Image src="f3logo.png" style={{
                            marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                        }} />
                        <Card.Body>
                            <Card.Title>
                                    {t("forum.toolsTitle")}</Card.Title>
                                <Card.Text>{t("forum.toolsSubtitle")}</Card.Text>
                        </Card.Body>

                    </div>
                </Link><hr />


                    <Link href="forum/threads?category=maridaje&id=4">
                    <div className="d-flex align-items-top">
                        <Image src="f4logo.svg" style={{
                            marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                        }} />
                        <Card.Body>
                            <Card.Title>{t("forum.winesTitle")}</Card.Title>
                                <Card.Text>{t("forum.winesSubtitle")}</Card.Text>
                        </Card.Body>

                    </div>
                </Link><hr />
            </Card>
        </Container>
        </Suspense>
    );
}
