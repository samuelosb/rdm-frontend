/*  *****************************************************

    This component provides a search interface for recipes,
    allowing users to specify various filters and criteria
    to refine their search results.
    Link: /search/results
    Mandatory params: ?query=

    ******************************************************/

'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export default function Search() {
    const {t} = useTranslation("global");

    const [query, setQuery] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [dishType, setDishType] = useState('');
    const [mealType, setMealType] = useState('');
    const [health, setHealth] = useState('');
    const [diet, setDiet] = useState('');
    const [ingr, setIngr] = useState('');
    const [calories, setCalories] = useState('');
    const [time, setTime] = useState('');
    const router = useRouter();

    const cuisineOptions = {
        "American": t("search.cuisineTypes.American"),
        "Asian": t("search.cuisineTypes.Asian"),
        "British": t("search.cuisineTypes.British"),
        "Caribbean": t("search.cuisineTypes.Caribbean"),
        "Central Europe": t("search.cuisineTypes.CentralEurope"),
        "Chinese": t("search.cuisineTypes.Chinese"),
        "Eastern Europe": t("search.cuisineTypes.EasternEurope"),
        "French": t("search.cuisineTypes.French"),
        "Indian": t("search.cuisineTypes.Indian"),
        "Italian": t("search.cuisineTypes.Italian"),
        "Japanese": t("search.cuisineTypes.Japanese"),
        "Kosher": t("search.cuisineTypes.Kosher"),
        "Mediterranean": t("search.cuisineTypes.Mediterranean"),
        "Mexican": t("search.cuisineTypes.Mexican"),
        "Middle Eastern": t("search.cuisineTypes.MiddleEastern"),
        "Nordic": t("search.cuisineTypes.Nordic"),
        "South American": t("search.cuisineTypes.SouthAmerican"),
        "South East Asian": t("search.cuisineTypes.SouthEastAsian")
    };

    const dishOptions = {
        "Biscuits and cookies": t("search.dishTypes.BiscuitsAndCookies"),
        "Bread": t("search.dishTypes.Bread"),
        "Cereals": t("search.dishTypes.Cereals"),
        "Condiments and sauces": t("search.dishTypes.CondimentsAndSauces"),
        "Desserts": t("search.dishTypes.Desserts"),
        "Drinks": t("search.dishTypes.Drinks"),
        "Main course": t("search.dishTypes.MainCourse"),
        "Pancake": t("search.dishTypes.Pancake"),
        "Preps": t("search.dishTypes.Preps"),
        "Preserve": t("search.dishTypes.Preserve"),
        "Salad": t("search.dishTypes.Salad"),
        "Sandwiches": t("search.dishTypes.Sandwiches"),
        "Side dish": t("search.dishTypes.SideDish"),
        "Soup": t("search.dishTypes.Soup"),
        "Starter": t("search.dishTypes.Starter"),
        "Sweets": t("search.dishTypes.Sweets")
    };

    const mealOptions = {
        "Breakfast": t("search.mealTypes.Breakfast"),
        "Dinner": t("search.mealTypes.Dinner"),
        "Lunch": t("search.mealTypes.Lunch"),
        "Snack": t("search.mealTypes.Snack"),
        "Teatime": t("search.mealTypes.Teatime")
    };

    const healthOptions = {
        "alcohol-cocktail": t("search.healthOptions.alcoholCocktail"),
        "alcohol-free": t("search.healthOptions.alcoholFree"),
        "celery-free": t("search.healthOptions.celeryFree"),
        "crustacean-free": t("search.healthOptions.crustaceanFree"),
        "dairy-free": t("search.healthOptions.dairyFree"),
        "DASH": t("search.healthOptions.DASH"),
        "egg-free": t("search.healthOptions.eggFree"),
        "fish-free": t("search.healthOptions.fishFree"),
        "fodmap-free": t("search.healthOptions.fodmapFree"),
        "gluten-free": t("search.healthOptions.glutenFree"),
        "immuno-supportive": t("search.healthOptions.immunoSupportive"),
        "keto-friendly": t("search.healthOptions.ketoFriendly"),
        "kidney-friendly": t("search.healthOptions.kidneyFriendly"),
        "kosher": t("search.healthOptions.kosher"),
        "low-fat-abs": t("search.healthOptions.lowFatAbs"),
        "low-potassium": t("search.healthOptions.lowPotassium"),
        "low-sugar": t("search.healthOptions.lowSugar"),
        "lupine-free": t("search.healthOptions.lupineFree"),
        "Mediterranean": t("search.healthOptions.Mediterranean"),
        "mollusk-free": t("search.healthOptions.molluskFree"),
        "mustard-free": t("search.healthOptions.mustardFree"),
        "no-oil-added": t("search.healthOptions.noOilAdded"),
        "paleo": t("search.healthOptions.paleo"),
        "peanut-free": t("search.healthOptions.peanutFree"),
        "pescatarian": t("search.healthOptions.pescatarian"),
        "pork-free": t("search.healthOptions.porkFree"),
        "red-meat-free": t("search.healthOptions.redMeatFree"),
        "sesame-free": t("search.healthOptions.sesameFree"),
        "shellfish-free": t("search.healthOptions.shellfishFree"),
        "soy-free": t("search.healthOptions.soyFree"),
        "sugar-conscious": t("search.healthOptions.sugarConscious"),
        "sulfite-free": t("search.healthOptions.sulfiteFree"),
        "tree-nut-free": t("search.healthOptions.treeNutFree"),
        "vegan": t("search.healthOptions.vegan"),
        "vegetarian": t("search.healthOptions.vegetarian"),
        "wheat-free": t("search.healthOptions.wheatFree")
    };

    const dietOptions = {
        "balanced": t("search.diets.balanced"),
        "high-fiber": t("search.diets.highFiber"),
        "high-protein": t("search.diets.highProtein"),
        "low-carb": t("search.diets.lowCarb"),
        "low-fat": t("search.diets.lowFat"),
        "low-sodium": t("search.diets.lowSodium"),
        "low-sugar": t("search.diets.lowSugar"),
        "no-alcohol": t("search.diets.noAlcohol"),
        "immunity": t("search.diets.immunity"),
        "vegetarian": t("search.diets.vegetarian"),
        "vegan": t("search.diets.vegan"),
        "paleo": t("search.diets.paleo")
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const params = {
            query,
            cuisineType,
            dishType,
            mealType,
            health,
            diet,
            ingr,
            calories,
            time,
        };

        // Remove empty params and ensure all values are strings
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '').map(([k, v]) => [k, String(v)])
        );
        const queryString = new URLSearchParams(filteredParams).toString();
        router.push(`/search/results?${queryString}`);
    };

    return (
        <Container className="d-flex justify-content-center" style={{paddingTop: '8%', paddingBottom: '20%'}}>
            <div className="w-75">
                <h2 className="text-center" style={{paddingBottom: '2%'}}>{t("search.title")}</h2>
                <Form className="pb-5 mt-4" onSubmit={handleFormSubmit}>
                    <Form.Group controlId="searchBar" style={{position: 'relative'}}>
                        <input
                            type="search"
                            className="form-control"
                            placeholder={t("search.placeholder")}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <button type="submit" style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="search-icon"
                                    style={{cursor: 'pointer'}}
                                />
                            </button>
                        </div>
                    </Form.Group>

                    <Row className="justify-content-md-center mt-3 text-center">
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setCuisineType(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-cuisine-type">
                                    {cuisineType ? cuisineOptions[cuisineType] : t("search.cuisineTypes.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(cuisineOptions).map(cuisine => (
                                        <Dropdown.Item eventKey={cuisine}
                                                       key={cuisine}>{cuisineOptions[cuisine]}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setDishType(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-dish-type">
                                    {dishType ? dishOptions[dishType] : t("search.dishTypes.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(dishOptions).map(dish => (
                                        <Dropdown.Item eventKey={dish} key={dish}>{dishOptions[dish]}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setMealType(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-meal-type">
                                    {mealType ? mealOptions[mealType] : t("search.mealTypes.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(mealOptions).map(meal => (
                                        <Dropdown.Item eventKey={meal} key={meal}>{mealOptions[meal]}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setHealth(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-health">
                                    {health ? healthOptions[health] : t("search.healthOptions.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(healthOptions).map(healthOption => (
                                        <Dropdown.Item eventKey={healthOption}
                                                       key={healthOption}>{healthOptions[healthOption]}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center mt-3 text-center">
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setDiet(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-diet">
                                    {diet ? dietOptions[diet] : t("search.diets.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(dietOptions).map(dietOption => (
                                        <Dropdown.Item eventKey={dietOption}
                                                       key={dietOption}>{dietOptions[dietOption]}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setIngr(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-ingredients">
                                    {ingr ? t(`search.ingredients.${ingr}`) : t("search.ingredients.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["0-3", "4-7", "8+"].map(ingrOption => (
                                        <Dropdown.Item eventKey={ingrOption}
                                                       key={ingrOption}>{t(`search.ingredients.${ingrOption}`)}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setCalories(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-calories">
                                    {calories ? t(`search.calories.${ingr}`) : t("search.calories.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["100-200", "200-300", "300-400", "400+"].map(calOption => (
                                        <Dropdown.Item eventKey={calOption} key={calOption}>{calOption}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown onSelect={(e) => setTime(e)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-time">
                                    {time ? t(`search.time.${ingr}`) : t("search.time.placeholder")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["0-15", "15-30", "30-45", "45+"].map(timeOption => (
                                        <Dropdown.Item eventKey={timeOption}
                                                       key={timeOption}>{timeOption}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Container>
    );
}
