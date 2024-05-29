/**
 * This module contains the post list of a particular category,
 * it allows registered users to create new posts (threads), on the current category.
 */
"use client"
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import {Button, Col, Row, Form, Modal, Breadcrumb} from 'react-bootstrap';
import {useState, useRef, useEffect} from 'react';
import moment from 'moment';

import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/navigation';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import jwt from 'jsonwebtoken';
import {getCookie, hasCookie} from 'cookies-next';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';


export default function Threads() {

    const [t] = useTranslation("global");
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('id');
    const categoryTitle = searchParams.get('category');
    const [inputTitle, setinputTitle] = useState('');
    const [inputContent, setinputContent] = useState('');
    const [threads, setThreads] = useState([]);
    const [filterQuery, setFilterQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showResults, setshowResults] = useState(false);
    const [loggedId, setLoggedId] = useState('');
    const router = useRouter();

    const handleTitleChange = (event) => {
        setinputTitle(event.target.value);
    };
    const handleContentChange = (event) => {
        setinputContent(event.target.value);
    };

    // Provides functionality to the search bar on the threads view. It returns the posts that matches
    // the input provided by the user.
    const searchThreads = async (event) => {
        try {
            setIsLoading(true);
            event.preventDefault();
            const requestOptions = {
                method: 'GET',
            };
            const response = await fetch(process.env.NEXT_PUBLIC_POSTS_URL + "/search?q=" + filterQuery + '&cId=' + categoryId, requestOptions);
            if (response.status === 200) {
                const initialThreadsList = await response.json();

                //For each post, make a promise to retrieve all usernames of the corresponing user Ids
                const updatedThreadsList = await Promise.all(
                    initialThreadsList.posts.map(async (thread) => {

                        //  Calls the users details fetch function, with the ID as parameter
                        const userDetails = await fetchUserDetails(thread.authorId);
                        return {thread, ...userDetails};
                    })
                );
                setThreads(updatedThreadsList);

            }
            if (response.status === 404) {
                setThreads([]);
            }
        } finally {
            setshowResults(true);
            setIsLoading(false);
        }

    }

    const handleFilterChange = (event) => {
        setFilterQuery(event.target.value); // Update the search query state on each input change
    };

    // If the visitor tries to use a restricted functionality without a logged in accout,
    // it is asked for login
    const redirectToLogin = (loggedUserId) => {
        if (loggedUserId === '') {
            router.push('/auth/login')
        }
    }

    useEffect(() => {
        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            setLoggedId((jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE))).id);
        }
        fetchThreads();

        // Close Modal on pressing ESC
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && show) {
                setShow(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [show]);

    const fetchUserDetails = async (uId) => {
        // Makes the call to get the recipe´s details, by it ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/getUserById?id=${uId}`);
        const data = await response.json();
        return data;
    };

    const fetchThreads = async () => {
        try {
            const requestOptions = {
                method: 'GET',
            };
            const response = await fetch(process.env.NEXT_PUBLIC_POSTS_URL + "/getAllByCategoryRecent?catId=" + categoryId, requestOptions);
            if (response.status === 200) {
                const initialThreadsList = await response.json();

                //For each post, make a promise to retrieve all usernames of the corresponing user Ids
                const updatedThreadsList = await Promise.all(
                    initialThreadsList.posts.map(async (thread) => {

                        //  Calls the users details fetch function, with the ID as parameter
                        const userDetails = await fetchUserDetails(thread.authorId);
                        return {thread, ...userDetails};
                    })
                );
                setThreads(updatedThreadsList);
            }
        } finally {
            setIsLoading(false);
        }
    };


    const postData = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify(
                {
                    "authorId": loggedId,
                    "content": inputContent,
                    "categoryId": categoryId,
                    "postTitle": inputTitle,
                }
            )
        };

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_POSTS_URL + "/create", requestOptions);
        } finally {
            router.push(`/forum`);
        }
    };

    return (

        <Container>
            <br/>
            <Modal transition={"true"} show={show} onHide={() => setShow(false)}>
                <Container>
                    <Card className="mx-9">{t("forum.creatingNewThread")}...
                        <Form>
                            <Row className="mx-9">
                                <Form.Group as={Col} controlId="nameCtrl">
                                    <Form.Label>{t("forum.threadTitle")}</Form.Label>
                                    <Form.Control value={inputTitle} onChange={handleTitleChange}
                                                  required
                                                  type="text"
                                    />
                                    <Form.Control.Feedback/>
                                </Form.Group>
                            </Row>
                            <Row className="mx-9">
                                <Form.Group as={Col} controlId="emailCtrl">
                                    <Form.Label>{t("forum.message")}</Form.Label>
                                    <Form.Control value={inputContent} onChange={handleContentChange} as="textarea"
                                                  rows={3}/>
                                    <Form.Control.Feedback/>
                                </Form.Group>
                            </Row>

                            <Container fluid>
                                <Button className="me-4" variant="secondary"
                                        onClick={() => setShow(!show)}>{t("forum.close")}</Button>
                                <Button variant="dark" onClick={postData}> ☑ {t("forum.create")}</Button>
                            </Container>
                        </Form><br/>
                    </Card>
                </Container>

            </Modal>
            <Breadcrumb>
                <Breadcrumb.Item href="/forum">{t("forum.categories")}</Breadcrumb.Item>
                <Breadcrumb.Item active href="#"><strong>{t("forum.forumOf")} {categoryTitle}</strong></Breadcrumb.Item>
            </Breadcrumb>
            <Container fluid className="vh-100">
                <Row className="d-fluid">
                    <Col xs={6}>
                        <form className="search-form">
                            <input
                                type="search"
                                className="form-control"
                                placeholder={t("forum.srchIn")}
                                value={filterQuery}
                                onChange={handleFilterChange}
                            />
                            <div className="icons-container">
                                <button onClick={() => searchThreads(event)}
                                        style={{border: 'none', background: 'none'}}>
                                    <FontAwesomeIcon
                                        icon={faMagnifyingGlass}
                                        className="search-icon"
                                    />
                                </button>
                            </div>
                        </form>

                        <br/></Col>

                    <Col xs={3}><Button variant='dark' ref={target}
                                        onClick={() => (redirectToLogin(loggedId), setShow(!show))}>{t("forum.newThread")}</Button></Col>

                </Row>

                {/*This part of the code read the JSON content and present it in a Card Style with the desired format*/}
                <Card className="mb-0 px-12">
                    <Card.Header>{t("forum.forumThreads")}<br/>
                        <Row className='align-items-center'>
                            <Col xs={6} sm={6} md={6} className="text-truncate small-text">{t("forum.titles")}</Col>
                            <Col xs={4} sm={3} md={2}
                                 className="text-center small-text mt-2 mt-sm-0">{t("forum.date")}</Col>
                            <Col sm={2} md={2}
                                 className="text-center  mt-2 mt-sm-0 d-none d-sm-block">{t("forum.author")}</Col>
                            <Col xs={2} sm={2} md={2}
                                 className="text-truncate text-center small-text mt-2 mt-sm-0">{t("forum.replys")}</Col>
                        </Row>


                    </Card.Header>
                    {showResults ? (<a>Resultados:</a>) : (<></>)}

                    {isLoading ? (
                            <Loading/>
                        ) :
                        !isLoading && showResults && threads.length === 0 ? (
                                <Container flex>{t("forum.noThreadsFound")}</Container>
                            ) :
                            !isLoading && threads.length === 0 ? (
                                <Container flex>{t("forum.noThreadsInCategory")}</Container>
                            ) : (
                                threads.map((thread) => (
                                    <Card.Body key={thread.thread.postId} className="mb-3">
                                        <a href={`/forum/viewThread?thread=${thread.thread.postId}&category=${categoryTitle}`}>
                                            <Row className='align-items-center'>
                                                <Col xs={6} sm={6} md={6}>
                                                    <div className="text-truncate small-text"
                                                         title={thread.thread.postTitle}>
                                                        {thread.thread.postTitle}
                                                    </div>
                                                </Col>
                                                <Col xs={4} sm={2} md={2} className="text-center mt-2 mt-sm-0">
                                <span
                                    className="small-text">{moment(thread.thread.timePublication).format("DD/MM/YYYY HH:mm")}</span>
                                                </Col>
                                                <Col sm={2} md={2}
                                                     className="text-center mt-2 mt-sm-0 d-none d-sm-block">
                                                    <Image className="align-middle" src="/profile.png" width="25"
                                                           height="25" alt="Profile"/>
                                                    <span className="small-text">{thread.username}</span>
                                                </Col>
                                                <Col xs={2} sm={12} md={2} className="text-center mt-2 mt-sm-0">
                                                    <span className="small-text">{thread.thread.numberOfComments}</span>
                                                </Col>
                                            </Row>
                                        </a>
                                    </Card.Body>
                                ))
                            )}

                </Card>
            </Container>
        </Container>

    );
}
