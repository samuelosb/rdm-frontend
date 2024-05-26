"use client";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import {Breadcrumb, Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {useRouter, useSearchParams} from 'next/navigation';
import moment from "moment";
import styles from "../../page.module.css";
import jwt from 'jsonwebtoken';
import {useEffect, useRef, useState} from "react";
import {getCookie, hasCookie} from "cookies-next";
import Loading from "../../components/Loading";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useTranslation} from 'react-i18next';

export default function ViewThread() {

    const [t] = useTranslation("global");
    const [show, setShow] = useState(false);
    const target = useRef('');
    const searchParams = useSearchParams()
    const postId = searchParams.get('thread')
    const category = searchParams.get('category')
    const [mainPost, setmainPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [inputMessage, setMessageContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loggedId, setLoggedId] = useState('');
    const [admOpt, setAdmOpt] = useState('false');
    const router = useRouter();

    useEffect(() => {

        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            setLoggedId((jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE))).id);
            if (jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)).role == "Admin") {
                setAdmOpt(true);
            }
        }
        fetchPost();

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

    const checkAdmin = () => {
        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            return (jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)).role == "Admin")
        }
    };

    const handleContentChange = (event) => {
        setMessageContent(event.target.value);
    };

    const fetchUserDetails = async (uId) => {
        // Makes the call to get the recipe´s details, by it ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/getUserById?id=${uId}`);
        const data = await response.json();
        return data;
    };

    const redirectToLogin = (loggedUserId) => {
        if (loggedUserId == '') {
            // If the visitor tries to use the week menu without a logged in accout,
            // it is asked for login
            router.push('/auth/login')
        }
    }

    const fetchPost = async () => {
        try {
            const requestOptions = {
                method: 'GET',
            };
            const origPost = await fetch(process.env.NEXT_PUBLIC_POSTS_URL + "/get?postId=" + postId, requestOptions);
            const responses = await fetch(process.env.NEXT_PUBLIC_COMMS_URL + "/getAllCommsByPostRecent?postId=" + postId, requestOptions);
            const initialorigPost = await origPost.json();
            const initialResponses = await responses.json();
            if (responses.status != "404") {
                //For each post, make a promise to retrieve all usernames of the corresponing user Ids
                const updatedResponses = await Promise.all(
                    initialResponses.comms.map(async (comm) => {

                        //  Calls the users details fetch function, with the ID as parameter
                        const userDetails = await fetchUserDetails(comm.authorId);
                        return {comm, ...userDetails};
                    }))

                setComments(updatedResponses);

            }

            if (origPost.status != "404") {
                const updatedOrigPost = await (async (post) => {
                    //  Calls the users details fetch function, with the ID as parameter
                    const userDetails = await fetchUserDetails(initialorigPost.post.authorId);
                    return {post, ...userDetails};
                })(initialorigPost.post);
                setmainPost(updatedOrigPost);
            }

        } finally {
            setIsLoading(false);
        }
    };

    const deleteMessage = async (id, mType) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            }
        };

        try {
            console.log(mType)
            if (mType == "post") {
                const response = await fetch(process.env.NEXT_PUBLIC_POSTS_URL + "/delete?postId=" + id, requestOptions);
            } else if (mType == "comm") {
                const response = await fetch(process.env.NEXT_PUBLIC_COMMS_URL + "/delete?commentId=" + id, requestOptions);
            }
        } finally {
            if (mType == "post") {
                router.push('/forum')
            } else if (mType == "comm") {
                window.location.reload()
            }
        }
    };

    const ban = async (uId, name) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify(
                {
                    "id": uId,
                }
            )
        };

        try {
            console.log(uId)
            const response = await fetch(process.env.NEXT_PUBLIC_USERS_URL + "/banUser", requestOptions);
        } finally {
            toast.success(t("userConfig.banned") + name);
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
                    "content": inputMessage,
                    "postId": postId
                }
            )
        };

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_COMMS_URL + "/create", requestOptions);
        } finally {
            window.location.reload();
            setShow(!show)
        }
    };

    return (
        <>
            <ToastContainer/>
           
            <Container className={"my-4 px-5"}>
                {isLoading ? (
                    <Loading/>

                ) : !isLoading && mainPost.length == 0 ? (
                    <Container className={styles.main}>POST NOT FOUND</Container>
                ) : (<>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/forum">Categorías</Breadcrumb.Item>
                                <Breadcrumb.Item href={`/forum/threads?id=${mainPost.post.categoryId}&category=${category}`}>Foro de {category}</Breadcrumb.Item>
                                <Breadcrumb.Item active href="#"><strong>{t("forum.messagesOf")} {mainPost.post.postTitle}</strong></Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col>
                                
                            </Col>

                            <Col xs="auto" className="ml-auto">
                                <Button variant='dark' ref={target}
                                        onClick={() => (redirectToLogin(loggedId), setShow(!show))}>{t("forum.reply")}</Button>
                            </Col>
                        </Row>


                        <Card className={"mt-1"}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>
                                            {/*<Image href='/profile.png' />*/}
                                            <img src="/profile.png" width="25" height="25"
                                                 className="mx-1 align-center"/>
                                            {mainPost.username}
                                        </Card.Title>

                                    </Col>
                                    <Col className="d-flex align-items-center justify-content-end">
                                        <h6 className="text-muted">{moment(mainPost.post.timePublication).format("DD/MM/YYYY HH:mm")}</h6>
                                    </Col>
                                </Row>

                                <Row>
                                    {checkAdmin() && (<Col>
                                        Admin:
                                        <OverlayTrigger overlay={<Tooltip>Eliminar Mensaje</Tooltip>}><Card.Link
                                            href="#">
                                            <img onClick={() => deleteMessage(mainPost.post.postId, "post")}
                                                 src="../delMessage.png" width="29" height="25"
                                                 className="mx-1 align-center"/></Card.Link></OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>Bloquear Usuario</Tooltip>}><Card.Link
                                            href="#">
                                            <img onClick={() => (ban(mainPost.post.authorId))} src="../blockUser.jpg"
                                                 width="25"
                                                 height="25"
                                                 className="mx-1 align-center"/></Card.Link></OverlayTrigger>
                                    </Col>)
                                    }
                                </Row>

                                <Card.Text>
                                    <div
                                        dangerouslySetInnerHTML={{__html: mainPost.post.content.replace(/\n/g, '<br />')}}/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </>
                )}

                {/*  Comments (replies) to the original post message */}
                {isLoading ? (<></>) :

                    //If there are no comments on this post, do not try to load the comments
                    !isLoading && comments == undefined ? (<></>) :

                        (<>
                                <div>
                                    {comments.map((comm) => (
                                        <Card key={comm.comm.commentId} className={"mt-2"}>
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Title>
                                                            {/*<Image href='/profile.png' />*/}

                                                            <img src="/profile.png" width="25" height="25"
                                                                 className="mx-1 align-center"/>
                                                            {comm.username}
                                                        </Card.Title>

                                                    </Col>
                                                    <Col className="d-flex align-items-center justify-content-end">
                                                        <h6 className="align-center text-muted">{moment(comm.comm.timePublication).format("DD/MM/YYYY HH:mm")}</h6>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    {checkAdmin() && (<Col>
                                                        Admin: <Card.Link href="#">
                                                        <OverlayTrigger overlay={<Tooltip>Eliminar Mensaje</Tooltip>}>
                                                            <img
                                                                onClick={() => deleteMessage(comm.comm.commentId, "comm")}
                                                                src="../delMessage.png" width="29" height="25"
                                                                className="mx-1 align-center"/>
                                                        </OverlayTrigger>
                                                    </Card.Link>
                                                        <Card.Link href="#"><img
                                                            onClick={() => (ban(comm.comm.authorId, comm.username))}
                                                            src="../blockUser.jpg" width="25" height="25"
                                                            className="mx-1 align-center"/></Card.Link>
                                                    </Col>)}
                                                </Row>

                                                <Card.Text>
                                                    <div
                                                        dangerouslySetInnerHTML={{__html: comm.comm.content.replace(/\n/g, '<br />')}}/>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}</div>


                                <Modal transition={true} show={show} onHide={() => setShow(false)}>
                                <Container>
                                        <Card className="mx-9">
                                            <Form>
                                                <Row className="mx-9">
                                                    <Form.Label>{t("forum.replyingTo")}
                                                        <strong>{mainPost.post.postTitle}</strong></Form.Label>
                                                </Row>
                                                <Row className="mx-9">
                                                    <Form.Group as={Col} controlId="emailCtrl">
                                                        <Form.Label>{t("forum.message")}</Form.Label>
                                                        <Form.Control autoFocus value={inputMessage}
                                                                      onChange={handleContentChange} as="textarea"
                                                                      rows={9}/>
                                                        <Form.Control.Feedback/>
                                                        <br/>
                                                    </Form.Group>
                                                </Row>

                                                <Container className="me-4" fluid>
                                                    <Button className="me-4" variant="secondary"
                                                            onClick={() => (setShow(!show))}>{t("forum.close")}</Button>
                                                    <Button variant="dark"
                                                            onClick={() => postData()}> ☑ {t("forum.send")}</Button>
                                                </Container>
                                            </Form><br/>
                                        </Card>
                                    </Container>

                                </Modal>
                            </>
                        )}


            </Container>
        </>
    );
}
