import { useContext, useEffect} from "react";
import { Context } from "../store/appContext";
import "../styles/home.css";
import { BreweryCard } from "../component/BootstrapCard";
import Modal from "../component/searchModal";

export const Search = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		actions.getBreweryReviewsFromBackend();
	}, []); // Empty array ensures it runs only once

	const eachBrewery = store.breweryData.map((breweryData, index) => (
		<BreweryCard key={index} breweryData={breweryData} />
	))

	return (
		<div className="home-container">
			<img src={"/img/DALL·E 2024-09-04.webp"} alt="Background" className="background-image" />
			<div className="content">
				<div className="text-center mt-5">
					<img src={"/img/HomeLogo1.png"} />
					<div className="my-2">
						< Modal />
						<div className="container">
							<div className="row">
								{eachBrewery}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};