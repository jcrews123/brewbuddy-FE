import useDefaultStore from "../store/store";

export const BeerCard = (props) => {
    console.log(props)
    const store = useDefaultStore()
    const actions = useDefaultStore()
console.log(store.favoriteBeers)
    return (
        <div className="card col-sm-6 col-md-4 my-2">
            <div className="card-body">
                <div className="d-flex">
                    <h2 className="card-title mx-auto">
                        <button className={`btn btn-outline-dark me-2 fa-${store.favoriteBeers.find(beer=>beer.beer_name==props.beerData.beer_name)?"solid":"regular"} fa-star`} onClick={(e) => {
                            if (store.token){actions.addFavoriteBeer(props.beerData.id)} 
                            else{alert("Please login to add or remove favorites")}
                            }}></button>
                        {/* J.R.: A specific image for brewery types */}
                        {props.beerData.beer_name}
                    </h2>
                </div>
                <div>
                    <div className="row justify-content-between bg-danger">
                        <h5 className="col">Type:</h5>
                        <h5 className="col">{props.beerData.type}</h5>



                    </div>
                    <div className="row justify-content-between bg-light">
                        <h5 className="col">Flavor:</h5>
                        <h5 className="col">{props.beerData.flavor}</h5>

                    </div>
                    <div className="row justify-content-between bg-secondary">
                        <h5 className="col">ABV:</h5>
                        <h5 className="col">{props.beerData.ABV} %</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}