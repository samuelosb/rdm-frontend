/**
 * ViewThread Component
 * This component is responsible for displaying a forum thread and its comments.
 * It includes functionality for administrators to ban/unban users and delete posts/comments.
 * Users can also reply to the thread.
 */

"use client";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import {Breadcrumb, Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip, Badge} from "react-bootstrap";
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
    const searchParams = useSearchParams();
    const postId = searchParams.get('thread');
    const category = searchParams.get('category');
    const [mainPost, setMainPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [inputMessage, setMessageContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loggedId, setLoggedId] = useState('');
    const [admOpt, setAdmOpt] = useState(false);
    const router = useRouter();

    // Fetch the thread and its comments on component mount
    useEffect(() => {
        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            const decodedToken = jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE));
            setLoggedId(decodedToken.id);
            if (decodedToken.role === "Admin") {
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

    // Check if the current user is an admin
    const checkAdmin = () => {
        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            return jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)).role === "Admin";
        }
        return false;
    };

    const handleContentChange = (event) => {
        setMessageContent(event.target.value);
    };

    const fetchUserDetails = async (uId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/getUserById?id=${uId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return {username: 'Unknown', role: 'Unknown'}; // Return a default value on error
        }
    };

    const redirectToLogin = (loggedUserId) => {
        if (loggedUserId === '') {
            router.push('/auth/login');
        }
    };

    const fetchPost = async () => {
        try {
            const requestOptions = {
                method: 'GET',
            };
            const origPostResponse = await fetch(`${process.env.NEXT_PUBLIC_POSTS_URL}/get?postId=${postId}`, requestOptions);
            const responsesResponse = await fetch(`${process.env.NEXT_PUBLIC_COMMS_URL}/getAllCommsByPostRecent?postId=${postId}`, requestOptions);

            if (!origPostResponse.ok || !responsesResponse.ok) {
                throw new Error('Failed to fetch post or comments');
            }

            const initialOrigPost = await origPostResponse.json();
            const initialResponses = await responsesResponse.json();

            if (initialResponses.message !== "No comments found for this post.") {
                const updatedResponses = await Promise.all(
                    initialResponses.comms.map(async (comm) => {
                        const userDetails = await fetchUserDetails(comm.authorId);
                        return {comm, ...userDetails};
                    })
                );
                setComments(updatedResponses);
            }

            if (initialOrigPost.status !== 404) {
                const updatedOrigPost = await (async (post) => {
                    const userDetails = await fetchUserDetails(post.authorId);
                    return {post, ...userDetails};
                })(initialOrigPost.post);
                setMainPost(updatedOrigPost);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMessage = async (id, mType) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)}`
            }
        };

        try {
            let deleteUrl;
            if (mType === "post") {
                deleteUrl = `${process.env.NEXT_PUBLIC_POSTS_URL}/delete?postId=${id}`;
            } else if (mType === "comm") {
                deleteUrl = `${process.env.NEXT_PUBLIC_COMMS_URL}/delete?commentId=${id}`;
            }

            const response = await fetch(deleteUrl, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to delete message');
            }

            if (mType === "post") {
                router.push('/forum');
            } else if (mType === "comm") {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Error deleting message');
        }
    };

    const ban = async (uId, name) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)}`
            },
            body: JSON.stringify({"userId": uId})
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/banUser`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to ban user');
            }

            setComments(prevComments => prevComments.map(comm =>
                comm.comm.authorId === uId ? {...comm, role: 'Banned'} : comm
            ));
            if (mainPost.post.authorId === uId) {
                setMainPost(prevMainPost => ({
                    ...prevMainPost,
                    role: 'Banned'
                }));
            }
            toast.success(t("userListPage.banSuccess") + ' ' + name);
        } catch (error) {
            console.error('Error banning user:', error);
            toast.error(t("userListPage.errorBanningUser"));
        }
    };

    const unban = async (uId, name) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)}`
            },
            body: JSON.stringify({"userId": uId})
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/unbanUser`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to unban user');
            }

            setComments(prevComments => prevComments.map(comm =>
                comm.comm.authorId === uId ? {...comm, role: 'Basic'} : comm
            ));
            if (mainPost.post.authorId === uId) {
                setMainPost(prevMainPost => ({
                    ...prevMainPost,
                    role: 'Basic'
                }));
            }
            toast.success(t("userListPage.unbanSuccess") + ' ' + name);
        } catch (error) {
            console.error('Error unbanning user:', error);
            toast.error(t("userListPage.errorUnbanningUser"));
        }
    };

    const postData = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)}`
            },
            body: JSON.stringify({
                "authorId": loggedId,
                "content": inputMessage,
                "postId": postId
            })
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_COMMS_URL}/create`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            window.location.reload();
            setShow(!show);
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Error posting comment');
        }
    };

    return (
        <>
            <ToastContainer/>
            <Container className={"my-4 px-5"}>
                {isLoading ? (
                    <Loading/>
                ) : !isLoading && mainPost.length === 0 ? (
                    <Container className={styles.main}>POST NOT FOUND</Container>
                ) : (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/forum">{t("forum.categories")}</Breadcrumb.Item>
                            <Breadcrumb.Item
                                href={`/forum/threads?id=${mainPost.post.categoryId}&category=${category}`}>
                                {t("forum.forumOf")} {category}
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active href="#">
                                <strong>{t("forum.messagesOf")} {mainPost.post.postTitle}</strong>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col></Col>
                            <Col xs="auto" className="ml-auto">
                                <Button variant='dark' ref={target}
                                        onClick={() => (redirectToLogin(loggedId), setShow(!show))}>
                                    {t("forum.reply")}
                                </Button>
                            </Col>
                        </Row>
                        <Card className={"mt-1"}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>
                                            <img src="/profile.png" width="25" height="25"
                                                 className="mx-1 align-center"/>
                                            {mainPost.username} <Badge bg="secondary">{mainPost.role}</Badge>
                                        </Card.Title>
                                    </Col>
                                    <Col className="d-flex align-items-center justify-content-end">
                                        <h6 className="text-muted">{moment(mainPost.post.timePublication).format("DD/MM/YYYY HH:mm")}</h6>
                                    </Col>
                                </Row>
                                <Row>
                                    {checkAdmin() && (
                                        <Col>
                                            {t("forum.adminOptions") + ': '}
                                            <OverlayTrigger overlay={<Tooltip>Eliminar Mensaje</Tooltip>}>
                                                <Card.Link href="#">
                                                    <img onClick={() => deleteMessage(mainPost.post.postId, "post")}
                                                         src="../delMessage.png" width="29" height="25"
                                                         className="mx-1 align-center"/>
                                                </Card.Link>
                                            </OverlayTrigger>
                                            {mainPost.role === 'Banned' ? (
                                                <OverlayTrigger overlay={<Tooltip>Desbloquear Usuario</Tooltip>}>
                                                    <Card.Link href="#">
                                                        <img
                                                            onClick={() => unban(mainPost.post.authorId, mainPost.username)}
                                                            src="../unblockUser.png" width="25" height="25"
                                                            className="mx-1 align-center"/>
                                                    </Card.Link>
                                                </OverlayTrigger>
                                            ) : (
                                                <OverlayTrigger overlay={<Tooltip>Bloquear Usuario</Tooltip>}>
                                                    <Card.Link href="#">
                                                        <img
                                                            onClick={() => ban(mainPost.post.authorId, mainPost.username)}
                                                            src="../blockUser.jpg" width="25" height="25"
                                                            className="mx-1 align-center"/>
                                                    </Card.Link>
                                                </OverlayTrigger>
                                            )}
                                        </Col>
                                    )}
                                </Row>
                                <Card.Text
                                    dangerouslySetInnerHTML={{__html: mainPost.post.content.replace(/\n/g, '<br />')}}/>
                            </Card.Body>
                        </Card>
                    </>
                )}
                {isLoading ? (
                    <></>
                ) : !isLoading && comments === undefined ? (
                    <></>
                ) : (
                    <>
                        <div>
                            {comments.map((comm) => (
                                <Card key={comm.comm.commentId} className={"mt-2"}>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <Card.Title>
                                                    <img src="/profile.png" width="25" height="25"
                                                         className="mx-1 align-center"/>
                                                    {comm.username} <Badge bg="secondary">{comm.role}</Badge>
                                                </Card.Title>
                                            </Col>
                                            <Col className="d-flex align-items-center justify-content-end">
                                                <h6 className="align-center text-muted">{moment(comm.comm.timePublication).format("DD/MM/YYYY HH:mm")}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {checkAdmin() && (
                                                <Col>
                                                    Admin: <Card.Link href="#">
                                                    <OverlayTrigger overlay={<Tooltip>Eliminar Mensaje</Tooltip>}>
                                                        <img onClick={() => deleteMessage(comm.comm.commentId, "comm")}
                                                             src="../delMessage.png" width="29" height="25"
                                                             className="mx-1 align-center"/>
                                                    </OverlayTrigger>
                                                </Card.Link>
                                                    {comm.role === 'Banned' ? (
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>Desbloquear Usuario</Tooltip>}>
                                                            <Card.Link href="#">
                                                                <img
                                                                    onClick={() => unban(comm.comm.authorId, comm.username)}
                                                                    src="../unblockUser.png" width="25" height="25"
                                                                    className="mx-1 align-center"/>
                                                            </Card.Link>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <OverlayTrigger overlay={<Tooltip>Bloquear Usuario</Tooltip>}>
                                                            <Card.Link href="#">
                                                                <img
                                                                    onClick={() => ban(comm.comm.authorId, comm.username)}
                                                                    src="../blockUser.jpg" width="25" height="25"
                                                                    className="mx-1 align-center"/>
                                                            </Card.Link>
                                                        </OverlayTrigger>
                                                    )}
                                                </Col>
                                            )}
                                        </Row>
                                        <Card.Text
                                            dangerouslySetInnerHTML={{__html: comm.comm.content.replace(/\n/g, '<br />')}}/>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                        <Modal transition={"true"} show={show} onHide={() => setShow(false)}>
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
                                                              onChange={handleContentChange} as="textarea" rows={9}/>
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
