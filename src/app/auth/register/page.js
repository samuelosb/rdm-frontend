'use client';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../../page.module.css";

export default function Register() {
    const { t } = useTranslation("global");
    const router = useRouter();

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [confirmPass, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [gender, setGender] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', gender: '', terms: '' });

    // Perform the actual registration using the available endpoint of the API
    const makeRegister = async (nm, em, pass, gender) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "username": nm,
                    "email": em,
                    "password": pass,
                    "gender": gender
                }
            )
        };

        const response = await fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/register", requestOptions);
        const res = await response.json();

        if (response.status === 201) {
            console.log('User registered successfully:', res);
            setCookie('registrationSuccess', 'true', { maxAge: 7 });
            router.push('/home');
        } else {
            console.log('Failed to register:', res.message);
            toast.error('Error en el registro.');
        }
    };

    // Check the requerimients of the registration data provided, and shows an error 
    // on each invalid input, with the reason.
    const handleSubmit = async (ev) => {
        const form = ev.currentTarget;
        ev.preventDefault();
        ev.stopPropagation();

        let newErrors = { name: '', email: '', password: '', confirmPassword: '', gender: '', terms: '' };
        if (form.checkValidity() === false || !passwordsMatch || !acceptedTerms) {
            if (!form.nameCtrl.value) newErrors.name = 'El nombre es requerido.';
            if (!form.emailCtrl.value || !/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i.test(form.emailCtrl.value)) newErrors.email = 'Por favor, ingrese un email válido.';
            if (!form.passCtrl.value || !/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/i.test(form.passCtrl.value)) newErrors.password = 'La contraseña es demasiado débil.';
            if (!passwordsMatch) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
            if (!gender) newErrors.gender = 'Por favor, seleccione un género.';
            if (!acceptedTerms) newErrors.terms = 'Debe aceptar los términos y condiciones.';

            setErrors(newErrors);
            setValidated(false);
        } else {
            setValidated(true);
            await makeRegister(name, email, pass, gender);
            setErrors({ name: '', email: '', password: '', confirmPassword: '', gender: '', terms: '' });
        }
    };

    const handleNameChange = (ev) => {
        setName(ev.target.value);
        if (errors.name) setErrors({ ...errors, name: '' });
    };

    const handleEmailChange = (ev) => {
        setEmail(ev.target.value);
        if (errors.email) setErrors({ ...errors, email: '' });
    };

    const handlePassChange = (ev) => {
        setPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === confirmPass);
    };

    const handleConfirmPassChange = (ev) => {
        setConfirmPassword(ev.target.value);
        setPasswordsMatch(ev.target.value === pass);
    };

    const handleGenderChange = (ev) => {
        setGender(ev.target.value);
    };

    const handleTermsChange = (ev) => {
        setAcceptedTerms(ev.target.checked);
    };

    return (
        <Container className={styles.main}>
            <p><b>{t("register.title")}</b></p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="nameCtrl">
                        <Form.Label>{t("register.name")}</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="John Doe"
                            onChange={handleNameChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="emailCtrl">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                            type="text"
                            placeholder="example@domain.com"
                            onChange={handleEmailChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="passCtrl">
                        <Form.Label>{t("register.pass")}</Form.Label>
                        <Form.Control
                            pattern="^(?=.*\d)(?=.*[a-zA-Z]).{6,}$"
                            type="password"
                            placeholder="Password"
                            onChange={handlePassChange}
                            required
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="pass2Ctrl">
                        <Form.Label>{t("register.repeatPass")}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={handleConfirmPassChange}
                            required
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="genderCtrl">
                        <Form.Label>{t("register.gender")}</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                id="male"
                                label={t("register.male")}
                                value="Hombre"
                                checked={gender === "Hombre"}
                                onChange={handleGenderChange}
                                isInvalid={!!errors.gender}
                            />
                            <Form.Check
                                type="radio"
                                id="female"
                                label={t("register.female")}
                                value="Mujer"
                                checked={gender === "Mujer"}
                                onChange={handleGenderChange}
                                isInvalid={!!errors.gender}
                            />
                            <Form.Check
                                type="radio"
                                id="nonBinary"
                                label={t("register.nonBinary")}
                                value="No binario"
                                checked={gender === "No binario"}
                                onChange={handleGenderChange}
                                isInvalid={!!errors.gender}
                            />
                            <Form.Check
                                type="radio"
                                id="preferNotToSay"
                                label={t("register.preferNotToSay")}
                                value="Prefiero no decirlo"
                                checked={gender === "Prefiero no decirlo"}
                                onChange={handleGenderChange}
                                isInvalid={!!errors.gender}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.gender}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                </Row>
                <Form.Group className="mb-4" controlId="termsCtrl">
                    <Form.Check
                        required
                        label={t("register.terms")}
                        checked={acceptedTerms}
                        onChange={handleTermsChange}
                        feedback={errors.terms}
                        feedbackType="invalid"
                        isInvalid={!!errors.terms}
                    />
                </Form.Group>
                <Container fluid>
                    <Button className="me-3" variant="secondary" href="/">{t("register.back")}</Button>
                    <Button variant="dark" type="submit">
                        <Image src="/check-square.svg" alt="Check icon" width={24} height={24} /> {t("register.submit")}
                    </Button>
                </Container>
            </Form>
            <ToastContainer position="top-right" autoClose={7000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Container>
    );
}
