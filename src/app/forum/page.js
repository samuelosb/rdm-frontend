/** 
 * Shows the main categories of the forum, with the title, a brief explanation of what the category 
 * is about, and a image for that category
*/

"use client";
import styles from "../page.module.css";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { Suspense, useState, useEffect } from "react";
import axios from 'axios';

export default function Forum() {
    const { t } = useTranslation("global");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {

                // Call the API to fetch categories
                const response = await axios.get(process.env.NEXT_PUBLIC_CATEGORIES_URL + "/getAllForForum");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching forum categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const getCategoryData = (id) => categories.find(category => category.categoryId === id);

    return (
        <Suspense fallback="Cargando...">
            <Container className={"my-4 px-5"}>
                <h6>{t("forum.header")}</h6>
                <br />
                <Card className="mb-0 px-12">
                    <Card.Header>{t("forum.title")}</Card.Header>

                    <a href="forum/threads?category=general&id=1">
                        <div className="d-flex align-items-top">
                            <Image src="/f1logo.png" style={{
                                marginTop: '20px', width: '50px', height: '50px', marginLeft: '15px'
                            }} />
                            <Card.Body>
                                {getCategoryData(1) ? (
                                    <>
                                        <Card.Title>{t("forum.genTitle")}</Card.Title>
                                        <Card.Text>{t("forum.genSubtitle")}</Card.Text>
                                    </>
                                ) : (
                                    <p>{t("forum.loading")}</p>
                                )}
                            </Card.Body>
                        </div>
                    </a><hr />

                    <a href="forum/threads?category=trucos&id=2">
                        <div className="d-flex align-items-top">
                            <Image src="/f2logo.png" style={{
                                marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                            }} />
                            <Card.Body>
                                {getCategoryData(2) ? (
                                    <>
                                        <Card.Title>{t("forum.hckTitle")}</Card.Title>
                                        <Card.Text>{t("forum.hckSubtitle")}</Card.Text>
                                    </>
                                ) : (
                                    <p>{t("forum.loading")}</p>
                                )}
                            </Card.Body>
                        </div>
                    </a><hr />

                    <a href="forum/threads?category=equipamiento&id=3">
                        <div className="d-flex align-items-top">
                            <Image src="f3logo.png" style={{
                                marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                            }} />
                            <Card.Body>
                                {getCategoryData(3) ? (
                                    <>
                                        <Card.Title>{t("forum.toolsTitle")}</Card.Title>
                                        <Card.Text>{t("forum.toolsSubtitle")}</Card.Text>
                                    </>
                                ) : (
                                    <p>{t("forum.loading")}</p>
                                )}
                            </Card.Body>
                        </div>
                    </a><hr />

                    <a href="forum/threads?category=maridaje&id=4">
                        <div className="d-flex align-items-top">
                            <Image src="f4logo.svg" style={{
                                marginTop: '20px', width: '59px', height: '59px', marginLeft: '15px'
                            }} />
                            <Card.Body>
                                {getCategoryData(4) ? (
                                    <>
                                        <Card.Title>{t("forum.winesTitle")}</Card.Title>
                                        <Card.Text>{t("forum.winesSubtitle")}</Card.Text>
                                    </>
                                ) : (
                                    <p>{t("forum.loading")}</p>
                                )}
                            </Card.Body>
                        </div>
                    </a><hr />
                </Card>
            </Container>
        </Suspense>
    );
}
