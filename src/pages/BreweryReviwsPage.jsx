import "../styles/home.css";
import { ReviewCard } from "../component/BootstrapCard";
import "../styles/BreweryRoute.css"
import { useParams } from "react-router"
import useDefaultStore from "../store/store";



export const BreweryReviews = () => {
    const store = useDefaultStore()

    const { id } = useParams()
    const breweryReviews = id in store.reviewsObject ? store.reviewsObject[id] : [];
    // store.reviewsObject.forEach(review => {

    // });
    // const eachReview = store.reviewsObject.map((breweryReviews, index) => (
    //     <BreweryCard key={index} breweryReviews={breweryReviews} />
    // ))
    return (
        <div>
            {breweryReviews.map((review, index) => (
                <ReviewCard
                    key={index}
                    review={review}
                    reviewNumber={index + 1}
                />
            ))}
            {breweryReviews.length < 1 && <p>No Reviews Found!</p>}
        </div>
    )
}