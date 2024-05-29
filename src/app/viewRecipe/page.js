/*  *****************************************************

    Page dedicated to the page that shows the details
    of a single recipe.


    Accesible in /viewRecipe

    ******************************************************/

"use client";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ReactStars from 'react-stars';
import {
    Row,
    Col,
    Button,
    Image,
    CardHeader,
    ListGroup,
    CardText,
    CardFooter,
    OverlayTrigger,
    Tooltip,
    Modal
} from "react-bootstrap";
import styles from "../page.module.css";
import {useRouter, useSearchParams} from 'next/navigation';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import jwt from 'jsonwebtoken';
import {getCookie, hasCookie} from 'cookies-next';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/Loading';

export default function ViewRecipe() {

    const {t} = useTranslation("global");
    const searchParams = useSearchParams();
    const recId = searchParams.get('r');
    const [data, setData] = useState([]);
    const [loggedId, setLoggedId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [onFavorites, setOnFavorites] = useState(false);
    const [showDays, setShowDays] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [numberOfRatings, setNumberOfRatings] = useState(0);
    const router = useRouter();

    const fetchUserRating = async (recipeId, userId) => {
        if (!userId) return {rating: 0};

        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId ? "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE) : ''
                }
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/user-rating?recipeId=${recipeId}&userId=${userId}`, requestOptions);
            if (response.ok) {
                const userRatingData = await response.json();
                return {
                    rating: userRatingData.userRating ? userRatingData.userRating : 0
                };
            } else {
                console.error('Failed to fetch user rating');
                return {rating: 0};
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
            return {rating: 0};
        }
    };

    const fetchAverageRating = async (recipeId) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/average-rating?recipeId=${recipeId}`, requestOptions);
            if (response.ok) {
                const averageRatingData = await response.json();
                return {
                    averageRating: averageRatingData.averageRating,
                    numberOfRatings: averageRatingData.numberOfRatings
                };
            } else {
                return {averageRating: 0, numberOfRatings: 0};
            }
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return {averageRating: 0, numberOfRatings: 0};
        }
    };

    const delFromFavorites = async (loggedUserId, recipeId) => {
        redirectToLogin(loggedUserId);

        const reqOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({"userId": loggedUserId, "recipeId": recipeId})
        };

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/delFav", reqOptions);
            if (response.ok) {
                setOnFavorites(false);
                toast.success('Removed from favorites');
            } else {
                toast.error('Failed to remove from favorites');
            }
        } catch (error) {
            toast.error('An error occurred while removing from favorites.');
            console.error('Error:', error);
        }
    };

    const addToFavorites = async (loggedUserId, recipeId) => {
        redirectToLogin(loggedUserId);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({"userId": loggedUserId, "recipeId": recipeId})
        };

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/addFav", requestOptions);
            if (response.ok) {
                setOnFavorites(true);
                toast.success('Added to favorites');
            } else {
                toast.error('Failed to add to favorites');
            }
        } catch (error) {
            toast.error('An error occurred while adding to favorites.');
            console.error('Error:', error);
        }
    };

    const redirectToLogin = (loggedUserId) => {
        if (!loggedUserId) {
            router.push('/auth/login');
        }
    };

    const addtoWeekMenu = async (loggedUserId, day) => {
        redirectToLogin(loggedUserId);

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({"userId": loggedUserId, "recipeId": recId, "day": day})
        };

        try {
            await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/addWeekMenu", requestOptions);
        } catch (error) {
            console.error('Error adding to week menu:', error);
        } finally {
            setShowDays(false);
        }
    };

    const handleRating = async (newRating) => {
        if (!loggedId) {
            router.push('/auth/login');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({
                userId: loggedId,
                recipeId: recId,
                rating: newRating
            })
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/rate`, requestOptions);
            if (response.ok) {
                toast.success('Rating submitted successfully!');
                setUserRating(newRating);
                const {averageRating} = await fetchAverageRating(recId);
                setAverageRating(averageRating);
            } else {
                toast.error('Failed to submit rating.');
            }
        } catch (error) {
            toast.error('An error occurred while submitting the rating.');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions = {method: 'GET'};
                const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/get?id=${recId}`, requestOptions);
                if (response.ok) {
                    const responseData = await response.json();
                    setData(responseData);
                } else {
                    console.error('Failed to fetch recipe data');
                }
            } catch (error) {
                console.error('Error fetching recipe data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const getFavState = async () => {
            if (!loggedId) return;

            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
                    }
                };
                const res1 = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/getFavs?id=${loggedId}`, requestOptions);
                if (res1.ok) {
                    const favList = await res1.json();
                    setOnFavorites(Array.isArray(favList) && favList.some(item => item.recipeId === recId));
                } else {
                    console.error('Failed to fetch favorites state');
                }
            } catch (error) {
                console.error('Error fetching favorites state:', error);
            }
        };

        const getUserRating = async () => {
            try {
                const ratingData = await fetchUserRating(recId, loggedId);
                setUserRating(loggedId ? ratingData.rating : 0);
            } catch (error) {
                console.error('Error fetching user rating:', error);
            }
        };

        const getAverageRating = async () => {
            try {
                const {averageRating, numberOfRatings} = await fetchAverageRating(recId);
                setAverageRating(averageRating);
                setNumberOfRatings(numberOfRatings);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        if (hasCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)) {
            const decoded = jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE));
            setLoggedId(decoded.id);
        }
        fetchData();
        getFavState();
        getUserRating();
        getAverageRating();
    }, [loggedId, recId]);

    useEffect(() => {
        if (loggedId) {
            const getUserRating = async () => {
                try {
                    const ratingData = await fetchUserRating(recId, loggedId);
                    setUserRating(ratingData.rating);
                } catch (error) {
                    console.error('Error fetching user rating:', error);
                }
            };
            getUserRating();
        }
    }, [loggedId]);

    return (
        <>
            <ToastContainer/>
            <Container className={styles.main}>
                {isLoading ? (
                    <Loading/>
                ) : (
                    <Row key={data.uri}>
                        <Card className="justify-content-center">
                            <CardHeader className="text-center"><strong>{data.recipe.label}</strong></CardHeader>
                            <Row>
                                <Col sm={4} lg={4} style={{maxHeight: "50%"}} className="flex sm">
                                    <Card.Img src={data.recipe.image}/>
                                </Col>
                                <Col className="text-center">
                                    {onFavorites ? (
                                        <Button variant="light" onClick={() => delFromFavorites(loggedId, recId)}>
                                            <OverlayTrigger overlay={<Tooltip>{t("viewRecipe.delFav")}</Tooltip>}>
                                                <Image style={{width: "80%"}} src="heart2.png"/>
                                            </OverlayTrigger>
                                        </Button>
                                    ) : (
                                        <Button variant="light" onClick={() => addToFavorites(loggedId, recId)}>
                                            <OverlayTrigger overlay={<Tooltip>{t("viewRecipe.addFav")}</Tooltip>}>
                                                <Image style={{width: "80%"}} src="heart.png"/>
                                            </OverlayTrigger>
                                        </Button>
                                    )}
                                    <Button variant="light" onClick={() => setShowDays(true)}>
                                        <OverlayTrigger overlay={<Tooltip>{t("viewRecipe.addWeek")}</Tooltip>}>
                                            <Image style={{width: "80%"}} src="calendar.png"/>
                                        </OverlayTrigger>
                                    </Button>
                                    <Row className="d-flex justify-content-center mt-2">
                                        <div className="d-flex justify-content-center">
                                            {t("viewRecipe.giveYourRating")}:
                                        </div>
                                    </Row>
                                    <Row className="d-flex justify-content-center">
                                        <div className="d-flex justify-content-center">
                                            <ReactStars
                                                count={5}
                                                value={userRating}
                                                edit={true}
                                                size={24}
                                                half={true}
                                                onChange={handleRating}
                                            />
                                        </div>
                                    </Row>
                                    <Row className="d-flex justify-content-center mt-2">
                                        <div className="d-flex justify-content-center">
                                            {t("viewRecipe.communityRating")}:
                                        </div>
                                    </Row>
                                    <Row className="d-flex justify-content-center">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <ReactStars
                                                count={5}
                                                value={averageRating}
                                                edit={false}
                                                size={24}
                                                half={true}
                                            />
                                            <span className="number-of-ratings">({numberOfRatings})</span>
                                        </div>
                                    </Row>

                                    <style jsx>{`
                                      .number-of-ratings {
                                        display: flex;
                                        align-items: center;
                                        margin-left: 5px;
                                      }
                                    `}</style>

                                    <Row className="text-center">
                                        <hr/>
                                        <CardText><strong>{data.recipe.yield} {t("viewRecipe.portions")}</strong></CardText>
                                        <CardText>{t("viewRecipe.nutrition")}:<br/>{Math.trunc(data.recipe.calories / data.recipe.yield)} {t("viewRecipe.calories")}
                                            / {t("viewRecipe.portion")}.</CardText>
                                        <ListGroup.Item>
                                            {data.recipe.healthLabels.map((healthLabel, index) => (
                                                <strong key={index}><i> {healthLabel + " | "}</i></strong>
                                            ))}
                                        </ListGroup.Item>
                                    </Row>
                                </Col>
                            </Row>
                            {data.recipe.ingredientLines.map((ingredient, index) => (
                                <ListGroup key={index} variant="flush">
                                    <ListGroup.Item className="text-center">{ingredient}</ListGroup.Item>
                                </ListGroup>
                            ))}
                            <CardFooter>
                                <Button style={{display: 'flex', justifyContent: 'center'}} href={data.recipe.url}
                                        variant="secondary">
                                    {t("viewRecipe.goToInstructions")} ( &nbsp;
                                    <i> {t("viewRecipe.at")} {data.recipe.source}</i>&nbsp; )
                                </Button>
                            </CardFooter>
                        </Card>
                    </Row>
                )}
            </Container>

            <Modal transition={showDays.toString()} show={showDays}>
                <Container>
                    <Card className="px-9">Agregar al menú de...
                        <Container>
                            <Row className="px-9">
                                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                                    <Button key={day} variant="light">
                                        <OverlayTrigger placement="right"
                                                        overlay={<Tooltip>{`Agregar al ${day}`}</Tooltip>}>
                                            <Image style={{width: "17%"}} src={`${day}.png`}
                                                   onClick={() => addtoWeekMenu(loggedId, day)}/>
                                        </OverlayTrigger>
                                    </Button>
                                ))}
                            </Row>
                        </Container>
                        <Container fluid>
                            <Button className="me-4" variant="secondary"
                                    onClick={() => setShowDays(!showDays)}>Cerrar</Button>
                        </Container>
                        <br/>
                    </Card>
                </Container>
            </Modal>

        </>
    );
}
