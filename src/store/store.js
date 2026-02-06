import { create } from "zustand";

const store = create((set, get) => ({
  token: sessionStorage.getItem("token") || "",
  userEmail: sessionStorage.getItem("userEmail") || null,
  // userData: null,
  userProfileImageId: null,
  breweryData: [],
  beerData: [],
  journey: new Journey(),
  reviewsObject: {},
  city: "",
  state: "",
  type: "",
  searchedBreweryData: [],
  favoriteBreweries: [],
  favoriteBeers: [],
  allBeers: [],
  favoritePeople: [],
  userRewards: [],
  over20: false,

  login: async (email, password) => {
				try {
					const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
						method: "POST",
						headers: { "Content-type": "application/json" },
						body: JSON.stringify({ email, password })
					});
					if (response.ok) {
						const data = await response.json();
						sessionStorage.setItem("token", data.access_token);
						sessionStorage.setItem("userEmail", email);
						set({
							token: data.access_token,
							userPoints: data.total_points,
							userEmail: email,
							userProfileImageId: data.profile_image ? data.profile_image.image_url : null
						});
						console.log("login successful");
						return { success: true, points_earned: data.points_earned, total_points: data.total_points };
					} else {
						const errorData = await response.json();
						console.error("login failed", errorData);
						return { success: false };
					}
				} catch (error) {
					console.error("Error during login", error);
					return { success: false, error: error.message };
				}
			},
            fetchBreweryInfoTEST: async () => {
                            try {
                                const resp = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=3", {
                                    method: "GET",
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                });
                                let data = await resp.json();
                                console.log(data);
                                const breweryInfos = data.map(brewery => new BreweryInfo(brewery));
                                const storeReviews = get().reviews;
            
                                // breweryInfos.forEach(brewery => {
                                // 	const breweryReviews = storeReviews.filter(review => review.brewery_id === brewery.id); OLD CODE FOR ADDING REVIEWS INTO ARRAY THAT IS NO MORE
                                // 	brewery.addReviews(breweryReviews);
                                // });
                                // .Create routes based on the brewery information (for example purposes, using dummy travel times and distances)
                                const routes = breweryInfos.map(info => new Route(new BreweryDestination(info), Math.floor(Math.random() * 60), Math.floor(Math.random() * 20)));
                                const journey = get().journey;
                                routes.forEach(route => journey.addRoute(route));
                                journey.setActiveRoute(0);
                                set({
                                    breweryData: breweryInfos,
                                    routes: routes,
                                    journey: journey
                                });
                                return journey;
                            } catch (error) {
                                console.error("Error fetching brewery info", error);
                            }
                        },
                        addFavoriteBrewery: async (brewery) => {
                            console.log(brewery)
                            try {
                                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorite_breweries/", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + sessionStorage.getItem("token")
            
                                    },
                                    body: JSON.stringify(brewery)
                                });
                                if (resp.ok) {
                                    const data = await resp.json();
                                    console.log("brewery added favorites: ", data);
            
                                    const store = get();
                                    set({
                                        favoriteBreweries: [...store.favoriteBreweries, brewery]
                                    });
                                    // alert("This Brewery has been added to your Favorites");
            
                                } else {
                                    const errorData = await resp.json();
                                    console.error("failed to add", errorData);
                                }
                            } catch (error) {
                                console.error("error adding brewery", error);
                            }
                        },
                        deleteFavoriteBrewery: async (brewery) => {
                            console.log(brewery)
                            try {
                                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorite_breweries/" + brewery.id, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + sessionStorage.getItem("token")
            
                                    },
                                });
                                if (resp.ok) {
                                    const data = await resp.json();
                                    console.log("brewery deleted from favorites: ", data);
            
                                    const store = get();
            
                                    set({
                                        favoriteBreweries: get().favoriteBreweries.filter((x) => {
                                            return x != brewery;
                                        })
                                    });
                                    console.log(get().favoriteBreweries)
                                    alert("This brewery has been deleted from your Favorites");
            
                                } else {
                                    const errorData = await resp.json();
                                    console.error("failed to add", errorData);
                                }
                            } catch (error) {
                                console.error("error deleting brewery", error);
                            }
                        },
                        searchFunctionWithCity: async () => {
                            try {
                                const store = get();
                                const actions = getActions();
                                const breweries = []
                                const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${store.city}`, {
                                    method: "GET",
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                });
                                let data = await response.json();
                                console.log(data)
                                const brewery = new BreweryInfo(data);
                                data.forEach(element => {
                                    if (element.state == store.state) {
                                        breweries.push(element)
                                    }
                                });
                                actions.createBreweryList(breweries)
                            } catch (error) {
                                console.error("Error fetching brewery info", error);
                            }
                        },
                        searchFunctionWithLocation: async (type) => {
                            const store = get();
                            const actions = getActions();
                            set({ type: type })
                            if ("geolocation" in navigator) {
                                try {
                                    navigator.geolocation.getCurrentPosition(async (position) => {
                                        const longitude = position.coords.longitude;
                                        const latitude = position.coords.latitude;
                                        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=20`)
                                        let data = await response.json();
                                        actions.createBreweryList(data)
                                    })
                                } catch (error) {
                                    console.error("Error fetching brewery info", error)
                                }
                            } else {
                                console.log("Geolocation is NOT available")
                            };
                        },
                        toggleSearch: () => {
                            const store = get();
                            if (store.modalIsOpen === false) {
                                set({ modalIsOpen: true })
                            } else {
                                set({ modalIsOpen: false, state: "", city: "" })
                            }
                        },
                        handleSearch: (city, state, type) => {
                            const actions = getActions();
                            set({ city: city, state: state, type: type })
                            actions.searchFunctionWithCity()
                        },
            
                        createBreweryList: (data) => {
                            const store = get();
                            //const brewery = new BreweryInfo(data);
                            const breweryType = `${store.type}`
                            const breweries = [];
                            const micro = "micro";
                            const nano = "nano";
                            const brewpub = "brewpub";
                            const regional = "regional";
                            console.log("type:", breweryType)
                            if (breweryType === "") {
                                for (const element of data) {
                                    if (element.brewery_type === micro || element.brewery_type === nano || element.brewery_type === brewpub || element.brewery_type === regional) {
                                        if (element.address_1 === null || element.latitude === null) {
                                            continue
                                        }
                                        const breweryInfo = new BreweryInfo(element)
                                        breweries.push(breweryInfo)
                                    }
                                }
                            } else {
                                for (const element of data) {
                                    if (element.brewery_type === `${breweryType}`) {
                                        if (element.address_1 === null || element.latitude === null) {
                                            continue
                                        }
                                        breweries.push(element)
                                    }
                                }
                            }
                            set({ breweryData: breweries })
                            console.log(store.breweryData)
                        },
                        fetchUserPoints: async () => {
                            try {
                                const resp = await fetch("/api/user/points", {
                                    headers: { 'Authorization': `Bearer ${token}` },
                                });
                                const data = await resp.json();
                                set({ userPoints: data.points });
                            } catch (error) {
                                console.error("Error fetching user points", error);
                            }
                        },
                        setUserPoints: (points) => {
                            set({ userPoints: points });
                        },
                        updateUserPoints: (newPoints) => {
                            set({ userPoints: newPoints });
                        },
                        addToCurrentJourney: async (breweryObject) => {
                            try {
            
                                const store = get();
                                // Create a BreweryDestination from the breweryObject
                                const breweryDestination = new BreweryDestination(breweryObject);
                                // Create a new Route with the BreweryDestination
                                const travelTime = Math.floor(Math.random() * (120 - 20 + 1)) + 20; // Random number between 20 and 120 minutes
                                const miles = Math.floor(Math.random() * (50 - 5 + 1)) + 5; // Random number between 5 and 50 miles
                                const newRoute = new Route(breweryDestination, travelTime, miles); // Replace 30 and 10 with actual travel time and miles
                                // Initialize a new journey if necessary
                                let currentJourney;
                                if (store.journey.length === 0) {
                                    currentJourney = new Journey();
                                    set({ ...store, journey: currentJourney });
                                } else {
                                    // Retrieve the existing journey
                                    currentJourney = store.journey;
                                    // If the existing journey is not an instance of Journey, reinitialize it
                                    if (!(currentJourney instanceof Journey)) {
                                        console.warn("Reinitializing current journey");
                                        currentJourney = new Journey();
                                        set({ ...store, journey: currentJourney });
                                    }
                                }
                                // Add the new route to the journey
                                currentJourney.addRoute(newRoute);
                                set({ ...store, journey: currentJourney });
                            } catch (error) {
                                console.error("Error adding to current journey", error);
                            }
                        },
                        getFavoriteBeers: async () => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite_beers`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                    },
                                });
            
                                if (response.ok) {
                                    const data = await response.json();
                                    set({ favoriteBeers: data });
                                } else {
                                    console.error("Failed to fetch favorite beers", response.status);
                                }
                            } catch (error) {
                                console.error("Error fetching favorite beers", error);
                            }
                        },
                        getBreweryBeers: async (uid) => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/brewery/beers/` + uid, {
                                    method: "GET",
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                })
                                const data = await response.json();
                                set({ beerData: data });
                                console.log(data)
                            }
                            catch (error) {
                                console.error("Error fetching beer info", error);
                            }
                        },
                        getAllBeers: async () => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/beers`, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                    },
                                });
            
                                if (response.ok) {
                                    const data = await response.json();
                                    set({ allBeers: data });
                                } else {
                                    console.error("Failed to fetch favorite beers", response.status);
                                }
                            } catch (error) {
                                console.error("Error fetching favorite beers", error);
                            }
                        },
            
                        addFavoriteBeer: async (beerId) => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite_beers/${beerId}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                    },
                                });
            
                                if (response.ok) {
                                    await getActions().getFavoriteBeers();
                                    let json = await response.json()
                                    alert(json.message);
                                    return true;
                                } else {
                                    console.error("Error adding favorite beer");
                                    return false;
                                }
                            } catch (error) {
                                console.error("Error adding favorite beer", error);
                                return false;
                            }
                        },
                        deleteFavoriteBeer: async (beer) => {
                            try {
                                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorite_beers/" + beer.id, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + sessionStorage.getItem("token")
            
                                    },
                                });
                                if (resp.ok) {
                                    const data = await resp.json();
                                    console.log("beer deleted from favorites: ", data);
            
                                    set((store)=> ({
                                        favoriteBeers: store.favoriteBeers.filter((x) => {
                                            return x != beer;
                                        })
                                    }));
                                    alert("This beer has been deleted from your Favorites");
            
                                } else {
                                    const errorData = await resp.json();
                                    console.error("failed to add", errorData);
                                }
                            } catch (error) {
                                console.error("error deleting beer", error);
                            }
                        },
            
                        getFavoritePeople: async () => {
                            let response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorite_users", {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + sessionStorage.getItem("token")
                                }
                            })
                            if (response.status != 200) {
                                console.log("error occurred while getting favorite users", response.status)
                                return false
                            }
                            let data = await response.json()
                            set({ favoritePeople: data })
                        },
                        getReviewsOnFrontEnd: async (breweryID) => {
                            const store = get();
            
                            // Ensure reviews are loaded in the store
                            if (!store.reviewsObject || !store.reviewsObject[breweryID]) {
                                console.log(`No reviews found for brewery with ID: ${breweryID}`);
                                return;
                            }
                            // Get reviews for the specific breweryID
                            const breweryReviews = store.reviewsObject[breweryID];
            
                            breweryReviews.forEach(review => {
                                console.log(`Review for Brewery ${breweryID}:`, review);
                            });
                        },
            
                        addBreweryReview: async (brewery, overallRating, reviewText, isFavoriteBrewery, beerReviews) => {
                            const store = get();
                            const currentJourney = store.journey;
            
                            const breweryReview = new BreweryReview(brewery, overallRating, reviewText, isFavoriteBrewery)
            
                            beerReviews.forEach(beerReview => {
                                breweryReview.addBeerReview(new BeerReview(beerReview.beerName, beerReview.rating, beerReview.notes, beerReview.isFavorite));
                            });
                            currentJourney.addBreweryReview(breweryReview);
                            set({ journey: currentJourney });
                        },
            
                        getBreweryReviewsFromBackend: async () => {
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_brewery_reviews`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                                if (response.ok) {
                                    const data = await response.json();
                                    const dataObject = {};
                                    for (const review of data) {
                                        if (review.brewery_id in dataObject) {
                                            dataObject[review.brewery_id].push(review)
                                        }
                                        else {
                                            dataObject[review.brewery_id] = [review]
                                        }
                                    }
                                    console.log("Reviews retrieved successfully:", data);
                                    set({
                                        reviewsObject: dataObject,
                                    });
                                } else {
                                    const errorData = await response.json();
                                    console.error("Failed to retrieve reviews", response.status, errorData);
                                    return null;
                                }
                            } catch (error) {
                                console.error("Error fetching brewery reviews:", error);
                                return null;
                            }
                        },
                        addBreweryReviewToBackend: async (breweryData, overallRating, reviewText, isFavoriteBrewery, beerReviews = []) => {
                            console.log("breweryData:", breweryData);  // Log the data for debugging
                            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/add_brewery_review', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${get().token}`
                                },
                                body: JSON.stringify({
                                    brewery_name: breweryData.name,
                                    brewery_id: breweryData.id,
                                    overall_rating: overallRating || 0,
                                    review_text: reviewText || "",  // Default to empty string if not provided
                                    is_favorite_brewery: isFavoriteBrewery || false,  // Default to false
                                    beer_reviews: beerReviews.map(beer => ({
                                        beer_name: beer.beer_name || "",
                                        rating: beer.rating || "",
                                        notes: beer.notes || "",  // Default to empty string if not provided
                                        is_favorite: beer.is_favorite || false  // Default to false
                                    }))
                                })
                            });
            
                            if (response.ok) {
                                const data = await response.json();
                                alert("Review added successfully");  
                                console.log (breweryData) 
                                if (breweryData.isFavorite){
                                    window.location="https://cuddly-space-couscous-5gvpvvqv7v6w37g6x-3000.app.github.dev/brewery/" + breweryData.id
                                }
                                return data;
                            } else {
                                const errorData = await response.json();
                                console.error("Failed to add review", response.status, errorData);
                                return null;
                            }
                        },
                        getFavoriteBreweries: async () => {
                            const token = sessionStorage.getItem("token");
                            try {
                                // Fetch favorite breweries with full details
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite_breweries`, {
                                    method: 'GET',
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json"
                                    }
                                });
            
                                if (response.ok) {
                                    const data = await response.json();
                                    set({ favoriteBreweries: data });  // Store the detailed favorite breweries
                                } else {
                                    console.error("Failed to fetch favorite breweries");
                                }
                            } catch (error) {
                                console.error("Error fetching favorite breweries", error);
                            }
                        },
                        // you need have a createFavoriteBeer (POST REQUEST) function then can attach it to card button
                        // probably the same thing for people
                        addNewBeer: async (name, flavor, type, ABV, brewery) => {
                            try {
                                let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/beers/add`, {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(
                                        {
                                            "beer_name": name,
                                            "flavor": flavor,
                                            "type": type,
                                            "ABV": ABV,
                                            "brewery_Id": brewery
                                        }
                                    )
                                })
                                if (response.status != 200) {
                                    console.log("error occurred while adding beer")
                                    return false
                                }
                                let data = await response.json()
                                console.log(data)
                                return true
                            }
                            catch (error) {
                                console.error("Error adding new beer", error)
                                return false
                            }
                        },
            
                        // Add the redeemReward action here:
                        redeemReward: async (rewardName) => {
                            const store = get();
                            const token = store.token; // Fetch the token from the store
            
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/points`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}` // Include token in headers
                                    },
                                    body: JSON.stringify({
                                        owner_id: store.userEmail, // Assuming userEmail is being used as an identifier
                                        reward_name: rewardName
                                    })
                                });
            
                                if (response.ok) {
                                    const result = await response.json();
                                    console.log(`Reward redeemed: ${result.message}`);
            
                                    // Fetch updated points after successful redemption
                                    getActions().fetchUserInfo();
            
                                    return { success: true, message: result.message };
                                } else {
                                    const errorResult = await response.json();
                                    console.error("Error redeeming reward:", errorResult);
            
                                    return { success: false, error: errorResult.error };
                                }
                            } catch (error) {
                                console.error("Error redeeming reward:", error);
                                return { success: false, error: error.message };
                            }
                        },
            
                        getRewardsFromBackend: async () => {
                            const store = get();
                            try {
                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_user_rewards`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${store.token}`, // Ensure token is sent in headers
                                    },
                                });
            
                                if (response.ok) {
                                    const data = await response.json();
                                    const eachReward = data.rewards.map((rewardData) =>
                                        new Reward(rewardData)
                                    )
                                    store.userRewards = eachReward
                                } else {
                                    console.error("Failed to fetch rewards:", response.statusText);
                                }
                            } catch (error) {
                                console.error("Error fetching user rewards:", error);
                            }
                        },
                        verifyAge: () => {
                            set({ over20: true });
                            sessionStorage.setItem("over20", true);
                        }
}));

