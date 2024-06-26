/*  *****************************************************

    This component displays the results of a search query
    for recipes. It fetches data from the backend, which
    in turn queries the Edamam API v2 for recipes.

    Link: /search/results
    Mandatory params: ?query=

    Features:
    - Displays a list of recipes based on search criteria.
    - Includes filters such as cuisine type, dish type, meal type, health labels, diet labels, ingredients, calories, and time.
    - Supports pagination by loading more data when the "Load More" button is clicked.
    - Allows users to drag and drop recipes to add them to their weekly menu.


    ******************************************************/

"use client";

import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Card, Button, Modal, Image} from 'react-bootstrap';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import {getCookie} from 'cookies-next';
import styles from "../../page.module.css";
import Loading from '../../components/Loading';
import {useTranslation} from 'react-i18next';
import {ToastContainer, toast} from 'react-toastify';
import {useRouter, useSearchParams} from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

export default function Results() {
    const {t} = useTranslation("global");
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('query') || '';
    const cuisineType = searchParams.get('cuisineType') || '';
    const dishType = searchParams.get('dishType') || '';
    const mealType = searchParams.get('mealType') || '';
    const health = searchParams.get('health') || '';
    const diet = searchParams.get('diet') || '';
    const ingr = searchParams.get('ingr') || '';
    const calories = searchParams.get('calories') || '';
    const time = searchParams.get('time') || '';
    const [loggedId, setLoggedId] = useState('');

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedRecipe, setDraggedRecipe] = useState('');
    const [showWeek, setShowWeek] = useState(false);
    const [timer, setTimer] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [error, setError] = useState(null);
    const isLoggedIn = !!getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE) && !!jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE));

    const redirectToLogin = (loggedUserId) => {
        if (!loggedUserId) {
            router.push('/auth/login');
        }
    };

    const addtoWeekMenu = async (day) => {
        redirectToLogin(loggedId);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({
                userId: loggedId,
                recipeId: draggedRecipe,
                day: day
            })
        };

        try {
            await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/addWeekMenu", requestOptions);
            toast.success(t("searchResults.recipeAdded"));
        } finally {
            setShowWeek(false);
        }
    };

    const handleDragStart = (recId) => {
        setDraggedRecipe(recId);
        const timeout = setTimeout(() => {
            setShowWeek(true);
        }, 500); // Timeout to bypass problems with the drag and drop with the DOM changing
        setTimer(timeout);
    };

    const handleDragEnd = () => {
        // Clear the timer if the recipe's card is released before the week options shows
        clearTimeout(timer);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event, dayOfWeek) => {
        event.preventDefault();
        addtoWeekMenu(dayOfWeek);
        setShowWeek(false);
    };

    const fetchData = async (url, append = false) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            setData(prevData => append ? [...prevData, ...responseData.hits] : responseData.hits);
            setNextPage(responseData._links?.next?.href || null);
        } catch (err) {
            setError(err.message);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams({
            q: search,
            ...(cuisineType && {cuisineType}),
            ...(dishType && {dishType}),
            ...(mealType && {mealType}),
            ...(health && {health}),
            ...(diet && {diet}),
            ...(ingr && {ingr}),
            ...(calories && {calories}),
            ...(time && {time}),
        });

        const initialUrl = `${process.env.NEXT_PUBLIC_RECIPES_URL}/search?${queryParams.toString()}`;
        fetchData(initialUrl);
    }, [search, cuisineType, dishType, mealType, health, diet, ingr, calories, time]);

    useEffect(() => {
        if (getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            const decoded = jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE));
            setLoggedId(decoded.id);
        }
    }, []);

    const loadMore = () => {
        if (nextPage) {
            fetchData(nextPage, true);
        }
    };

    return (
        <Container className={styles.main}>
            <h5 className={"mb-4"}>{t("searchResults.title")}</h5>
            <Container>
                <Row>
                    {isLoading && data.length === 0 ? (
                        <Loading/>
                    ) : error ? (
                        <Row className="justify-content-center">
                            <Col xs="auto" className="d-flex flex-column align-items-center">
                                <h5>{t("searchResults.noResultsFound")}</h5>
                                <Button onClick={() => router.push('/search')} variant="outline-secondary"
                                        className="mt-3">
                                    {t("searchResults.searchAgain")}
                                </Button>
                            </Col>
                        </Row>
                    ) : (
                        data.map(r => (
                            <Col key={r.recipe.uri.split("_")[1]} xs={11} sm={6} md={3} lg={2} className="mb-4">
                                <Link href={"/viewRecipe?r=" + r.recipe.uri.split("_")[1]}>
                                    <Card className='card text-center fluid'
                                          draggable={isLoggedIn}
                                          onDragStart={isLoggedIn ? () => handleDragStart(r.recipe.uri.split("_")[1]) : null}
                                          onDragEnd={isLoggedIn ? handleDragEnd : null}
                                          onDragOver={isLoggedIn ? handleDragOver : null}
                                    >
                                        <Card.Img className="card-img-top" variant="top" src={r.recipe.image}/>
                                        <Card.Body>
                                            <Card.Title>{r.recipe.label}</Card.Title>
                                            <hr/>
                                            <Card.Subtitle className="mb-2">
                                                {r.recipe.mealType} | {r.recipe.cuisineType}
                                            </Card.Subtitle>
                                            <br/>
                                            <Card.Subtitle>
                                                {r.recipe.yield} &nbsp; <img width="25" height="25"
                                                                             src='/rac.png'/>&nbsp;  |
                                                &nbsp;{Math.trunc(r.recipe.calories / r.recipe.yield)} cal.
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    )}
                </Row>
                {!isLoading && nextPage && (
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Button onClick={loadMore} variant="outline-secondary" className="mt-3 mb-3">
                                {t("searchResults.loadMore")}
                            </Button>
                        </Col>
                    </Row>
                )}

                {!isLoading && data.length === 0 && !error && (
                    <Row className="justify-content-center">
                        <Col xs="auto" className="d-flex flex-column align-items-center">
                            <h5>{t("searchResults.noResultsFound")}</h5>
                            <Button onClick={() => router.push('/search')} variant="outline-secondary" className="mt-3">
                                {t("searchResults.searchAgain")}
                            </Button>
                        </Col>
                    </Row>
                )}

                <Modal show={showWeek} onHide={() => setShowWeek(false)}>
                    <Container className="px-5">
                        <Card className="px-5">{t("searchResults.addToMenu")}
                            <Container>
                                <Row className="px-5">
                                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                                        <div key={day}
                                             onDrop={(event) => handleDrop(event, day)} // Utiliza onDrop en el contenedor
                                             onDragOver={(event) => event.preventDefault()} // Necesario para permitir la acción de soltar
                                        >
                                            <Button variant="light">
                                                <Image src={`../${day}.png`}/>
                                            </Button>
                                        </div>
                                    ))}
                                </Row>
                            </Container>
                            <br/>
                        </Card>
                    </Container>
                </Modal>
            </Container>
            <ToastContainer/>
        </Container>
    );
}
