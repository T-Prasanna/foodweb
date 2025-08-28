import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import api from "../api"; // ✅ Import should be at the top, not inside component

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");

  const loadFoodItems = async () => {
    try {
      const response = await api.get("/api/auth/foodData");
      setFoodItems(response.data[0]);
      setFoodCat(response.data[1]);
    } catch (error) {
      console.error("FoodData Error:", error);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Carousel Section */}
      <div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: "9" }}>
              <div className="d-flex justify-content-center">
                {/* Search box */}
                <input
                  className="form-control me-2 w-75 bg-white text-dark"
                  type="search"
                  placeholder="Search in here..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn text-white bg-success"
                  onClick={() => setSearch("")}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="carousel-item active">
              <img
                src="https://foodish-api.com/images/biryani/biryani9.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="Biryani"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://foodish-api.com/images/pizza/pizza3.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="Pizza"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://foodish-api.com/images/dessert/dessert12.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="Dessert"
              />
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Food Categories + Items */}
      <div className="container">
        {foodCat.length > 0 &&
          foodCat.map((data) => (
            <div key={data._id} className="row mb-3">
              <div className="fs-3 m-3">{data.CategoryName}</div>
              <hr
                id="hr-success"
                style={{
                  height: "4px",
                  backgroundImage:
                    "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))",
                }}
              />
              {foodItems.length > 0 ? (
                foodItems
                  .filter(
                    (items) =>
                      items.CategoryName === data.CategoryName &&
                      items.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((filterItems) => (
                    <div
                      key={filterItems._id}
                      className="col-12 col-md-6 col-lg-3"
                    >
                      <Card
                        foodName={filterItems.name}
                        item={filterItems}
                        options={filterItems.options[0]}
                        ImgSrc={filterItems.img}
                      />
                    </div>
                  ))
              ) : (
                <div>No Such Data</div>
              )}
            </div>
          ))}
      </div>

      <Footer />
    </div>
  );
}
