/**
 * @module Login
 *
 * This module defines the Login component, which provides the user interface for logging into the application.
 * It includes form validation, authentication, and error handling. The component uses Bootstrap for styling
 * and layout, and it utilizes the React Context API for managing authentication state. Additionally,
 * it displays success and error messages using react-toastify.
 */

'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '../../../AuthContext';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {Container, Card} from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import styles from "../../page.module.css";
import {useTranslation} from 'react-i18next';
import {deleteCookie, setCookie} from 'cookies-next';
import jwt from 'jsonwebtoken';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [incorrectMessage, setIncorrectMessage] = useState(false);
    const [bannedMessage, setBannedMessage] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email: '', password: ''});
    const {t} = useTranslation("global");
    const router = useRouter();
    const {setIsAuthenticated, setIsAdmin, setUser} = useAuth();

    const makeLogin = async (em, pass) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"email": em, "password": pass})
        };

        const response = await fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/login", requestOptions);
        const res = await response.json();

        if (response.status === 200) {
            const token = res.accessToken;
            deleteCookie("accessToken");
            setCookie('accessToken', token, {maxAge: 60 * 60 * 24});
            const dec = jwt.decode(token);
            console.log(dec);

            setCookie('loginSuccess', 'true', {maxAge: 7});
            setUser(dec);
            setIsAuthenticated(true); // Update authentication state
            setIsAdmin(dec.role === "Admin"); // Update admin state if necessary
            router.back();
        } else if (response.status === 403) {
            setBannedMessage(true);
        } else {
            setIncorrectMessage(true);
            console.log(incorrectMessage);
        }
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const form = ev.currentTarget;
        let newErrors = {email: '', password: ''};

        if (!email) {
            newErrors.email = 'El campo de email es requerido.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            newErrors.email = 'Por favor, ingrese un email válido.';
        }

        if (!password) {
            newErrors.password = 'El campo de contraseña es requerido.';
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors);
            setValidated(false);
        } else {
            setValidated(true);
            await makeLogin(email, password);
            setErrors({email: '', password: ''});
        }
    };

    const handleEmailChange = (ev) => {
        setEmail(ev.target.value);
        if (errors.email) setErrors({...errors, email: ''});
    };

    const handlePasswordChange = (ev) => {
        setPassword(ev.target.value);
        if (errors.password) setErrors({...errors, password: ''});
    };

    return (
        <Container className={`${styles.main} d-flex align-items-center justify-content-center`}
        >
            <Card className="p-4 bg-white">
                <Card.Body>
                    <h2 className="mb-3 text-center">{t("login.title")}</h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="emailCtrl">
                            <Form.Label column sm={12}>Email</Form.Label>
                            <Col sm={12}>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="example@domain.com"
                                    onChange={handleEmailChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="passwordCtrl">
                            <Form.Label column sm={12}>{t("login.pass")}</Form.Label>
                            <Col sm={12}>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder={t("login.pass")}
                                    onChange={handlePasswordChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                                {incorrectMessage && (
                                    <p className="text-danger mt-2">Login invalid</p>
                                )}
                                {bannedMessage && (
                                    <p className="text-danger mt-2">{t("login.banned")}</p>
                                )}
                                <Link href="/auth/forgot-password" className="d-block mt-2">
                                    {t("login.forget")}
                                </Link>
                            </Col>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" href="/">{t("login.back")}</Button>
                            <Button variant="dark" type="submit">
                                <Image src="/check-square.svg" alt="Check icon" width={24}
                                       height={24}/> {t("login.submit")}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer position="top-right" autoClose={7000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </Container>
    );
}
