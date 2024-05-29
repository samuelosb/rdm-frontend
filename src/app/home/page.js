/**
 * @module Home
 *
 * This module defines the Home component, which is the main landing page of the application.
 * It displays top-rated recipes, latest forum posts, most commented posts, and random recipes.
 */

'use client';
import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import {Placeholder, Card, Col, Row} from 'react-bootstrap';
import './home-view.css';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getCookie, deleteCookie} from 'cookies-next';
import ReactStars from 'react-stars';

export default function Home() {
    const [recipesData, setRecipesData] = useState([]);
    const [forumPostsData, setForumPostsData] = useState([]);
    const [mostCommentedPostsData, setMostCommentedPostsData] = useState([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [loadingForumPosts, setLoadingForumPosts] = useState(true);
    const [loadingMostCommentedPosts, setLoadingMostCommentedPosts] = useState(true);
    const [randomRecipesData, setRandomRecipesData] = useState([]);
    const [loadingRandomRecipes, setLoadingRandomRecipes] = useState(true);

    const {t} = useTranslation("global");

    // Helper function to extract the recipe id from the random recipe search from edamam
    function extractRecipeId(url) {
        // The data is provided in a different way, thus it has to be extracted in a different way than in top recipes
        const regex = /\/api\/recipes\/v2\/([^?]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Determine the difficulty level based on the number of ingredients
    const getDifficulty = (numIngredients) => {
        if (numIngredients <= 3) {
            return t("home.easy");
        } else if (numIngredients > 8) {
            return t("home.hard");
        } else {
            return t("home.medium");
        }
    };

    // Fetch the latest forum posts data from the server
    const loadForumPostsData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_POSTS_URL}/latest`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data.posts)) { // Ensure the data is an array
                setForumPostsData(data.posts);
            } else {
                setForumPostsData([]);
                console.error('Expected an array of posts but got:', data);
            }
        } catch (error) {
            console.error('Error fetching forum posts:', error);
            setForumPostsData([]); // Set as empty array on error
        } finally {
            setLoadingForumPosts(false);
        }
    };

    // Fetch the most commented forum posts data from the server
    const loadMostCommentedPostsData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_POSTS_URL}/most-commented`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data.posts)) {
                setMostCommentedPostsData(data.posts);
            } else {
                setMostCommentedPostsData([]);
                console.error('Expected an array of posts but got:', data);
            }
        } catch (error) {
            console.error('Error fetching most commented forum posts:', error);
            setMostCommentedPostsData([]); // Set as empty array on error
        } finally {
            setLoadingMostCommentedPosts(false);
        }
    };

    // Fetch random recipes from the server
    const loadRandomRecipesData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/random-recipes`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRandomRecipesData(data.hits);
            // console.log(data.hits)
        } catch (error) {
            console.error('Error fetching random recipes:', error);
            setRandomRecipesData([]);
        } finally {
            setLoadingRandomRecipes(false);
        }
    };


    useEffect(() => {
        setLoadingRecipes(true);
        setLoadingForumPosts(true);
        setLoadingMostCommentedPosts(true);
        setLoadingRandomRecipes(true);

        // Fetch dynamic recipes data from the server
        const loadDynamicRecipesData = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
                    }
                };
                const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/top-rated`, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipesData(data);
                // console.log(data);
            } catch (error) {
                console.error('Error fetching top-rated recipes:', error);
            } finally {
                setLoadingRecipes(false);
            }
        };

        // Check if registration success message needs to be shown
        const registrationSuccess = getCookie('registrationSuccess');
        if (registrationSuccess) {
            toast.success('Usuario registrado con éxito!');
            deleteCookie('registrationSuccess');
        }

        // Load dynamic data
        loadDynamicRecipesData();
        loadRandomRecipesData();
        loadForumPostsData();
        loadMostCommentedPostsData();
    }, []);

    return (
        <>
            <ToastContainer position="top-right" autoClose={7000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
            <Container fluid className="main-container">
                <Row>
                    <Col>
                        <h2 className={"mb-0"}>{t("home.topR")}</h2>
                    </Col>
                </Row>
                <Row className={"mb-4"}>
                    <div className="scrollable-row">
                        {loadingRecipes ? (
                            [...Array(4)].map((_, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Card>
                                        <Placeholder as={Card.Img} variant="top" animation="wave"/>
                                        <Card.Body>
                                            <Placeholder as={Card.Title} animation="wave">
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                            <Placeholder as={Card.Text} animation="wave">
                                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                                            </Placeholder>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            recipesData.map((recipe, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Link href={`/viewRecipe?r=${encodeURIComponent(recipe.uri?.split('_')[1] || '')}`}>
                                        <Card>
                                            <Card.Img variant="top" src={recipe.image}/>
                                            <Card.Body>
                                                <Card.Title>{recipe.label}</Card.Title>
                                                <div className="recipe-details">
                                                    <div className="rating">
                                                        <ReactStars
                                                            count={5}
                                                            value={recipe.averageRating}
                                                            edit={false}
                                                            size={18}
                                                            half={true}
                                                        />
                                                        <span>({recipe.numberOfRatings})</span>
                                                    </div>
                                                    <div className="middle-tag">{Math.round(recipe.calories)} kcal</div>
                                                    <div
                                                        className="right-tag">{getDifficulty(recipe.ingredients.length)}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))
                        )}
                    </div>
                </Row>
                <Row className={"mb-4"}>
                    <h2 className={"mb-0"}>{t("home.forumposts")}</h2>
                    <div className="scrollable-row">
                        {loadingForumPosts ? (
                            [...Array(4)].map((_, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Card>
                                        <Card.Body>
                                            <Placeholder as={Card.Title} animation="wave">
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                            <Placeholder as={Card.Text} animation="wave">
                                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                                            </Placeholder>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            forumPostsData.map((post) => (
                                <Col key={post._id} xs={12} sm={6} md={4} lg={3}>
                                    <a href={`forum/viewThread?thread=${post.postId}&page=1`}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{post.postTitle}</Card.Title>
                                                <Card.Text className="post-card-text">
                                                    {post.content}
                                                </Card.Text>
                                                <div className="post-details">
                                                    <span>{new Date(post.timePublication).toLocaleDateString()}</span>
                                                    <span className="right-tag">{post.numberOfComments} comments</span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </a>
                                </Col>
                            ))
                        )}
                    </div>
                </Row>
                <Row className={"mb-4"}>
                    <h2 className={"mb-0"}>{t("home.randomR")}</h2>
                    <div className="scrollable-row">
                        {loadingRandomRecipes ? (
                            [...Array(4)].map((_, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Card>
                                        <Placeholder as={Card.Img} variant="top" animation="wave"/>
                                        <Card.Body>
                                            <Placeholder as={Card.Title} animation="wave">
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                            <Placeholder as={Card.Text} animation="wave">
                                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                                            </Placeholder>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            randomRecipesData.map((recipe, index) => (

                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Link
                                        href={`/viewRecipe?r=${encodeURIComponent(extractRecipeId(recipe._links.self.href))}`}>
                                        <Card>
                                            <Card.Img variant="top" src={recipe.recipe.image}/>
                                            <Card.Body>
                                                <Card.Title>{recipe.recipe.label}</Card.Title>
                                                <div className="recipe-details">
                                                    <div className="rating">
                                                        <ReactStars
                                                            count={5}
                                                            value={recipe.averageRating}
                                                            edit={false}
                                                            size={18}
                                                            half={true}
                                                        />
                                                        <span>({recipe.recipe.numberOfRatings ? recipe.recipe.numberOfRatings : 0})</span>
                                                    </div>
                                                    <div
                                                        className="middle-tag">{Math.round(recipe.recipe.calories)} kcal
                                                    </div>
                                                    <div
                                                        className="right-tag">{getDifficulty(recipe.recipe.ingredients.length)}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))
                        )}
                    </div>
                </Row>

                <Row className={"mb-4"}>
                    <h2 className={"mb-0"}>{t("home.mostCommentedPosts")}</h2>
                    <div className="scrollable-row">
                        {loadingMostCommentedPosts ? (
                            [...Array(4)].map((_, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                                    <Card>
                                        <Card.Body>
                                            <Placeholder as={Card.Title} animation="wave">
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                            <Placeholder as={Card.Text} animation="wave">
                                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                                            </Placeholder>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            mostCommentedPostsData.map((post) => (
                                <Col key={post._id} xs={12} sm={6} md={4} lg={3}>
                                    <a href={`forum/viewThread?thread=${post.postId}&page=1`}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{post.postTitle}</Card.Title>
                                                <Card.Text className="post-card-text">
                                                    {post.content}
                                                </Card.Text>
                                                <div className="post-details">
                                                    <span>{new Date(post.timePublication).toLocaleDateString()}</span>
                                                    <span className="right-tag">{post.numberOfComments} comments</span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </a>
                                </Col>
                            ))
                        )}
                    </div>
                </Row>

            </Container>
        </>
    );
}
