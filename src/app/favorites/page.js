/*  *****************************************************

    Page dedicated to the view that shows the favorite recipes
    of the logged-in user.

    This view should only be visible when a user has
    logged in.

    Link: /favorites

    ******************************************************/

"use client";

import styles from "../page.module.css";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import {Button, Col, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Link from 'next/link';
import {useEffect, useState} from "react";
import moment from "moment";
import jwt from 'jsonwebtoken';
import {getCookie} from "cookies-next";
import Loading from "../components/Loading";

export default function Favorites() {

    const [t] = useTranslation("global");
    const [isLoading, setIsLoading] = useState(true);
    const [favList, setFavList] = useState([]);

    /**
     * Function to delete a recipe from the user's favorites.
     * @param {string} loggedUserId - The ID of the logged-in user.
     * @param {string} recipeId - The ID of the recipe to be deleted from favorites.
     */
    const delFromFavorites = async (loggedUserId, recipeId) => {
        const reqOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify({"userId": loggedUserId, "recipeId": recipeId})
        };
        try {
            await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/delFav", reqOptions);
            // Update the favList state to remove the deleted recipe
            setFavList(prevFavList => prevFavList.filter(favRec => favRec.recipe.uri.split("_")[1] !== recipeId));
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    useEffect(() => {

        /**
         * Function to fetch recipe details based on recipe ID.
         * @param {string} recipeId - The ID of the recipe to fetch details for.
         * @returns {object} - The recipe data.
         */
        const fetchRecipeData = async (recipeId) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/get?id=${recipeId}`);
            const data = await response.json();
            return data;
        };

        /**
         * Function to get the favorite recipes list of the logged-in user.
         */
        const getFavList = async () => {
            try {
                const opt1 = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
                    },
                };
                const res1 = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/getFavs?id=` +
                    (jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE))).id, opt1);

                const initialFavList = await res1.json();

                const updatedFavList = await Promise.all(
                    initialFavList.map(async (recipe) => {
                        const recipeData = await fetchRecipeData(recipe.recipeId);
                        return {recipe, ...recipeData};
                    })
                );
                setFavList(updatedFavList);
            } catch (error) {
                console.error('Error fetching initial fav list:', error);
            } finally {
                setIsLoading(false);
            }
        };
        getFavList();
    }, []);

    return (
        <Container className={styles.main}>
            <h5>{t("favorites.title")}</h5>
            <Container>
                {isLoading ? (
                        <Loading/>
                    ) :
                    !isLoading && favList.length === 0 ? (
                            <Container flex>Your favorites list is empty</Container>
                        ) :
                        (
                            <div>
                                <Row className="flex justify-content-center align-items-center">
                                    {favList.map((favRec) => (
                                        <Col key={favRec.recipe.uri} sm={5} md={2} lg={3}>
                                            <Link href={"/viewRecipe?r=" + favRec.recipe.uri.split("_")[1]}>
                                                <Card>
                                                    <Card.Img variant="top" src={favRec.recipe.image}/>
                                                    <Card.Body>
                                                        <Card.Title>{favRec.recipe.label}</Card.Title>
                                                        <Card.Text>{t("favorites.added")} {moment(favRec.addedDate).format("DD/MM/YYYY")}</Card.Text>
                                                    </Card.Body>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent the default behavior of the link
                                                            delFromFavorites((jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)).id), favRec.recipe.uri.split("_")[1]);
                                                        }}
                                                        variant="light"><Image src="delete.svg"/>
                                                    </Button>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
            </Container>
        </Container>
    );
}
