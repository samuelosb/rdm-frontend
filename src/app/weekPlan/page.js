
/*  *****************************************************
	
    Page dedicated to the view that shows all the saved recipes 
    for the week.
   
    This view should only be visible when a used has 
    logged in 
	
    Link: /weekPlan

    ******************************************************/

"use client";

// Import of ReactBootstrap components
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import styles from "./../page.module.css";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import Loading from '../components/Loading';





export default function WeekPlan() {

    const [t] = useTranslation("global");
    const [isLoading, setIsLoading] = useState(true);
    const [weekList, setWeekList] = useState([]);



    const delFromMenu = async (loggedUserId, recipeId, day) => {
        const reqOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
            },
            body: JSON.stringify(
                {
                    "userId": loggedUserId,
                    "recipeId": recipeId,
                    "day": day
                }
            )
        };
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_RECIPES_URL + "/delWeekMenu", reqOptions);
            if (response.ok) {
                setWeekList(prevWeekList => {
                    const updatedDayList = prevWeekList[day].filter(r => r.recipe.uri.split("_")[1] !== recipeId);
                    return { ...prevWeekList, [day]: updatedDayList };
                });
            }
        } catch (error) {
            console.error('Error deleting recipe from menu:', error);
        }
    };

    useEffect(() => {

        const fetchRecipeData = async (recipeId) => {
            // Makes the call to get the recipe´s details, by it ID
            const re = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/get?id=${recipeId}`);
            const data = await re.json();
            return data;
        };

        const getWeekList = async () => {
            try {
                //Call to the api to get the id list of the week menu
                const opt1 = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)
                    }
                };

                // Gets the initial list containing the days of the week, and the arrays with
                // the ids of the recipes saves on each day
                const res1 = await fetch(`${process.env.NEXT_PUBLIC_RECIPES_URL}/getWeekMenu?uId=`+
                    (jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE))).id, opt1);
                const initialWeekList = await res1.json();

                const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                const sortWeekList = {};
                daysOrder.forEach((day) => {
                    if (initialWeekList.hasOwnProperty(day)) {
                        sortWeekList[day] = initialWeekList[day];
                    }
                });

            
                const updatedWeekList = {};

                //For each day on the initial list
                for (const day in sortWeekList) {
                    if (Object.hasOwnProperty.call(sortWeekList, day)) {
                        const ids = sortWeekList[day];
                        // Make a promise to fetch the recipe's full details for all 
                        // the ids contained in that day
                        updatedWeekList[day] = await Promise.all(
                            ids.map(async (id) => {
                                const detailResponse = await fetchRecipeData(id);
                                return detailResponse;
                            })
                        );
                    }
                }
                // Overrides the initial list, with the new created list 
                // containing all the recipe's details.
                setWeekList(updatedWeekList);

            } catch (error) {
                console.error('Error fetching week list:', error);
            }
            finally {
                setIsLoading(false);
            }
        };

        getWeekList();

    }, []);


    return (
        <Container className={styles.main} >
            <h5>{t("week.title")}</h5>
            <Container>

                {isLoading ? (
                    <Loading/>
                ) : (
                    <>
                    {weekList && Object.entries(weekList).map(([day, recipes]) => (
                        <div key={day}>
                            <br/><br/><h2>{t("week."+day)}</h2>
                            <Row>
                                {recipes.map((r) => (
                                    <Col key={r.recipe.uri} sm={5} md={2} lg={3}>
                                        <Link href={"/viewRecipe?r=" + r.recipe.uri.split("_")[1]}>
                                            <Card className='card text-center'>
                                                <Card.Img variant="top" src={r.recipe.image} />
                                                <Card.Body>
                                                    <Card.Title>{r.recipe.label}</Card.Title>
                                                    <hr />
                                                    <Card.Subtitle>{r.recipe.mealType} | {r.recipe.cuisineType}</Card.Subtitle><br />
                                                    <Card.Subtitle>{r.recipe.yield} &nbsp; <img width="25" height="25" src='/rac.png' />&nbsp;  |
                                                        &nbsp;{Math.trunc(r.recipe.calories / r.recipe.yield)} cal.</Card.Subtitle>
                                                </Card.Body>
                                               
                                            </Card>
                                        </Link>
                                        <Button onClick={() => delFromMenu((jwt.decode(getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE)).id), r.recipe.uri.split("_")[1], day)}
                                            variant="light"><Image src="delete.svg" /></Button>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                    </>
                )}

            </Container>
        </Container>
    );
}
