'use client';

import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from "../page.module.css";
import UserLineChart from './lineChart/userLineChart';
import PostLineChart from './lineChart/postLineChart';
import CategoryPieChart from './pieChart/categoryPieChart';
import GenderPieChart from './pieChart/genderPieChart';
import TopPostsChart from './otherChart/topPostChart';
import TopUsuariosPorPublicaciones from './otherChart/topUserbyPostsChart';
import TopUsuariosPorComentarios from './otherChart/topUserbyComments';
import CommentLineChart from './lineChart/commentLineChart';
import axios from 'axios';

const AdminConfig = () => {
    const [userData, setUserData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [postData, setPostData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
                const headers = { 'Authorization': `Bearer ${token}` };

                const [usersResponse, commentsResponse, postsResponse, categoriesResponse] = await Promise.all([
                    axios.get(process.env.NEXT_PUBLIC_USERS_URL + "/getAll", { headers }),
                    axios.get(process.env.NEXT_PUBLIC_COMMS_URL + "/getAll", { headers }),
                    axios.get(process.env.NEXT_PUBLIC_POSTS_URL + "/getAll", { headers }),
                    axios.get(process.env.NEXT_PUBLIC_CATEGORIES_URL + "/getAll", { headers })
                ]);

                setUserData(usersResponse.data);
                setCommentData(commentsResponse.data);
                setPostData(postsResponse.data);
                setCategoryData(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Rafraîchir toutes les 60 secondes
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <Container className={styles.main}>
            <p className={styles.sectionTitle}><b>──────────────────   OPCIONES DE ADMINISTRADOR    ──────────────────</b></p>
            <Row>
                <Col>
                    <Link href="admin/userDataPersonal">
                        <Card className="text-center">
                            <Card.Header>Gestionar usarios registrados</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Listar usuarios y su información personal
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link href="../userConfig/changePass">
                        <Card className="text-center">
                            <Card.Header>Cambio de contraseña</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Cambia la contraseña de acceso a la cuenta.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <p className={styles.sectionTitle}><b>─────────────────────   ACTIVIDAD DEL SITIO    ─────────────────────</b></p>
            <br />
            <Row>
                <UserLineChart data={userData} />
            </Row>
            <br />
            <Row>
                <PostLineChart data={postData} />
            </Row>
            <br />
            <Row>
                <CommentLineChart data={commentData} />
            </Row>
            <br />
            <Row>
                <TopPostsChart data={postData} />
            </Row>
            <br />
            <div style={{ display: 'flex', width: '100%', height: '400px', alignItems: 'center' }}>
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <TopUsuariosPorComentarios data={userData} />
                </div>
                <div style={{ flex: '1', marginLeft: '10px' }}>
                    <TopUsuariosPorPublicaciones data={userData} />
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', width: '100%', height: '400px' }}>
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <CategoryPieChart data={categoryData} />
                </div>
                <div style={{ flex: '1', marginLeft: '10px' }}>
                    <GenderPieChart data={userData} />
                </div>
            </div>
        </Container>
    );
}

export default AdminConfig;
