/**
 * @module AdminConfig
 *
 * This module defines the AdminConfig component, which provides an interface for administrators
 * to view and manage various aspects of the site's data, including user information, comments, posts,
 * and categories. It displays multiple charts to visualize the activity on the site and allows
 * administrators to navigate to user management pages.
 *
 * Charts include:
 * - UserLineChart: User registration over time.
 * - PostLineChart: Post creation over time.
 * - CommentLineChart: Comment activity over time.
 * - TopPostsChart: Top posts based on engagement.
 * - TopUsuariosPorComentarios: Top users by comments.
 * - TopUsuariosPorPublicaciones: Top users by posts.
 * - CategoryPieChart: Distribution of posts across categories.
 * - GenderPieChart: Distribution of users by gender.
 */

'use client';

import React, {useState, useEffect} from 'react';
import {Card, Container, Row, Col} from 'react-bootstrap';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
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
    const {t} = useTranslation("global");
    const [userData, setUserData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [postData, setPostData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches all the necessary data for the charts from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the access token from cookies
                const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
                const headers = {'Authorization': `Bearer ${token}`};

                // Fetch data from multiple endpoints in parallel
                const [usersResponse, commentsResponse, postsResponse, categoriesResponse] = await Promise.all([
                    axios.get(process.env.NEXT_PUBLIC_USERS_URL + "/getAll", {headers}),
                    axios.get(process.env.NEXT_PUBLIC_COMMS_URL + "/getAll", {headers}),
                    axios.get(process.env.NEXT_PUBLIC_POSTS_URL + "/getAll", {headers}),
                    axios.get(process.env.NEXT_PUBLIC_CATEGORIES_URL + "/getAll", {headers})
                ]);
                // Update the state with the fetched data
                setUserData(usersResponse.data);
                setCommentData(commentsResponse.data);
                setPostData(postsResponse.data);
                setCategoryData(categoriesResponse.data);
                setLoading(false);
                
            } catch (error) {
                // Handle any errors that occur during data fetching
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
        // Refresh data every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>{t("adminOptions.loading")}</p>;
    if (error) return <p>{t("adminOptions.errorLoadingData")}: {error.message}</p>;

    return (
        <Container fluid className="d-flex flex-column align-items-center">
            <h2 className="text-center mt-4 mb-4">{t("adminOptions.adminOptions")}</h2>
            <Row className="mb-4 w-100 justify-content-center">
                <Col xs={12} md={8}>
                    <Link href="admin/userDataPersonal">
                        <Card className="text-center">
                            <Card.Header>{t("adminOptions.manageRegisteredUsers")}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {t("adminOptions.listUsersAndPersonalInfo")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>

            <h2 className="text-center mt-4 mb-4">{t("adminOptions.siteActivity")}</h2>
            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12}>
                    <UserLineChart data={userData} />
                </Col>
            </Row>
            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12}>
                    <PostLineChart data={postData} />
                </Col>
            </Row>
            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12}>
                    <CommentLineChart data={commentData} />
                </Col>
            </Row>
            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12}>
                    <TopPostsChart data={postData} />
                </Col>
            </Row>

            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12} lg={6}>
                    <TopUsuariosPorComentarios data={userData} />
                </Col>
                <Col xs={12} lg={6}>
                    <TopUsuariosPorPublicaciones data={userData} />
                </Col>
            </Row>

            <Row className="mb-5 w-100 justify-content-center">
                <Col xs={12} lg={6}>
                    <CategoryPieChart data={categoryData} />
                </Col>
                <Col xs={12} lg={6}>
                    <GenderPieChart data={userData} />
                </Col>
            </Row>
        </Container>
    );
};

export default AdminConfig;