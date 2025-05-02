import React, { useRef, useEffect, useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StoryCircle from "../../../Components/StoryCircle";
import "./StoryField.css";
import { Typography, Modal, Box } from "@mui/material";
import image1 from "../assets/1000000802.png";
import image2 from "../assets/1000000805.jpg";
import image3 from "../assets/1000000806.jpg";
import image4 from "../assets/1000000807.jpg";
import image5 from "../assets/1000000808.jpg";
import image6 from "../assets/1000000811.jpg";
import image7 from "../assets/1000000812.jpg";
import image8 from "../assets/1000000813.jpg";
import image9 from "../assets/1000000814.jpg";
import image10 from "../assets/1000000818.png";
import image11 from "../assets/1000000819.png";
import image12 from "../assets/golomtbank.applepay.jpg";
import image13 from "../assets/khaanbank.jpg";
import image14 from "../assets/tdb.png";

const ITEM_WIDTH = 200;

const StoryField = ({ content }) => {
  const containerRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal open state
  const [selectedImage, setSelectedImage] = useState(null);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    boxShadow: 24,
    padding: 1,
    borderRadius: 3,
    width: "60%", // Makes the image take up the full width of the screen
    maxWidth: "700px",
    textAlign: "center",
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image); // Set the selected image for the modal
    setOpenModal(true); // Open the modal
  };

  // Function to close modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  const currencyToMNT = [
    {
      code: "USD",
      name: "АНУ-ын доллар",
      flag: "https://flagpedia.net/data/flags/h80/us.png",
    },
    {
      code: "EUR",
      name: "Евро",
      flag: "https://flagpedia.net/data/org/w580/eu.webp",
    },
    {
      code: "GBP",
      name: "Их Британий фунт",
      flag: "https://flagpedia.net/data/flags/h80/gb.png",
    },
    {
      code: "CNY",
      name: "Хятадын юань",
      flag: "https://flagpedia.net/data/flags/h80/cn.png",
    },
    {
      code: "JPY",
      name: "Японы иен",
      flag: "https://flagpedia.net/data/flags/h80/jp.png",
    },
    {
      code: "KRW",
      name: "Өмнөд Солонгосын вон",
      flag: "https://flagpedia.net/data/flags/h80/kr.png",
    },
    {
      code: "RUB",
      name: "Оросын рубль",
      flag: "https://flagpedia.net/data/flags/h80/ru.png",
    },
    {
      code: "CAD",
      name: "Канадын доллар",
      flag: "https://flagpedia.net/data/flags/h80/ca.png",
    },
    {
      code: "AUD",
      name: "Австралийн доллар",
      flag: "https://flagpedia.net/data/flags/h80/au.png",
    },
    {
      code: "CHF",
      name: "Швейцарын франк",
      flag: "https://flagpedia.net/data/flags/h80/ch.png",
    },
    {
      code: "INR",
      name: "Энэтхэгийн рупи",
      flag: "https://flagpedia.net/data/flags/h80/in.png",
    },
    {
      code: "HKD",
      name: "Гонконгийн доллар",
      flag: "https://flagpedia.net/data/flags/h80/hk.png",
    },
    {
      code: "SGD",
      name: "Сингапурын доллар",
      flag: "https://flagpedia.net/data/flags/h80/sg.png",
    },
    {
      code: "THB",
      name: "Тайландын бат",
      flag: "https://flagpedia.net/data/flags/h80/th.png",
    },
    {
      code: "SEK",
      name: "Шведийн крон",
      flag: "https://flagpedia.net/data/flags/h80/se.png",
    },
  ];

  async function updateRates() {
    const base = "USD"; // Frankfurter supports base currencies like USD, EUR, etc.
    const symbols = currencyToMNT.map((cur) => cur.code).join(",");
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?from=${base}&to=${symbols}`
      );
      const data = await res.json();

      currencyToMNT.forEach((currency) => {
        if (currency.code === base) {
          currency.rate = 3550;
        } else {
          const usdToCode = data.rates[currency.code];
          const usdToMNT = 3550; // Use your static USD-MNT or pull from local bank
          currency.rate = usdToCode ? (usdToMNT / usdToCode).toFixed(2) : null;
        }
      });

      setRate(currencyToMNT);
    } catch (err) {
      console.error("Error fetching rates:", err);
    }
  }
  useEffect(() => {
    updateRates();
  }, []);

  // 🔁 Auto-scroll with pause logic
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (!isPaused && containerRef.current) {
        containerRef.current.scrollLeft += 0.5;
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  // ⏸ Pause auto-scroll when button is clicked
  const handleScroll = (scrollAmount) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollAmount;

      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 3000);
    }
  };

  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12,
    image13,
    image14,
  ];

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Left arrow button */}
      <div className="action-btns">
        <button onClick={() => handleScroll(-ITEM_WIDTH)}>
          {content === "currency" ? (
            <ArrowLeftIcon fontSize="large" />
          ) : (
            <div style={{ width: "40px" }}></div>
          )}
        </button>
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="hide-scrollbar"
        style={{
          width: "100%",
          overflowX: "scroll",
          scrollBehavior: "smooth",
        }}
      >
        <div className="content-box">
          {content === "story" && (
            <>
              {/* First map for images with hover effect */}
              {images.map((image, index) => (
                <div
                  className="card"
                  key={index}
                  style={{ position: "relative" }}
                >
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      marginRight: "14px",
                      background:
                        "linear-gradient(45deg, #7bd5f5, #787ff6, #1ca7ec, #1240bf)", // Gradient border using background
                      padding: "4px", // Padding creates the effect of the border
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "transform 0.3s ease", // Smooth transition on hover
                    }}
                    className="image-container"
                  >
                    <img
                      src={image}
                      alt={`Story ${index + 1}`}
                      style={{
                        width: "80px", // Size inside the circle (smaller than the outer container)
                        height: "80px", // Size inside the circle
                        borderRadius: "50%", // Make the image circular
                        objectFit: "cover", // Ensure the image covers the circle area
                        transition: "transform 0.3s ease", // Smooth transition for image scaling
                        // filter: "blur(0.7px)",
                      }}
                      onClick={() => handleOpenModal(image)} // Open modal on click
                      className="image"
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Display currency exchange rates if content is "currency" */}
          {content === "currency" &&
            rate
              ?.filter((item) => item.rate)
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: 190,
                    maxWidth: 200,
                    marginRight: 16,
                    border: "1px solid #cdd1dc",
                    borderRadius: 12,
                    padding: 5,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "0.3s",
                  }}
                >
                  <Typography variant="h6" fontWeight={500}>
                    <img
                      src={item.flag}
                      alt={item.code}
                      style={{ width: 24, marginRight: 8 }}
                    />
                    {item.code}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₮ {item.rate}
                  </Typography>
                </div>
              ))}
        </div>
      </div>

      {/* Right arrow button */}
      <div className="action-btns">
        <button onClick={() => handleScroll(ITEM_WIDTH)}>
          {content === "currency" ? (
            <ArrowRightIcon fontSize="large" />
          ) : (
            <div style={{ width: "40px" }}></div>
          )}
        </button>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-modal"
        aria-describedby="image-modal-description"
      >
        <Box sx={{ ...modalStyle, position: "relative" }}>
          {selectedImage &&
            (() => {
              const index = images.indexOf(selectedImage);
              return (
                <>
                  {/* Left Arrow - Only show if NOT the first image */}
                  {index > 0 && (
                    <ArrowLeftIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(images[index - 1]);
                      }}
                      sx={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 40,
                        cursor: "pointer",
                        color: "#ffffff",
                        zIndex: 10,
                      }}
                    />
                  )}

                  {/* Image */}
                  <img
                    src={selectedImage}
                    alt="Full-screen view"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />

                  {/* Right Arrow - Only show if NOT the last image */}
                  {index < images.length - 1 && (
                    <ArrowRightIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(images[index + 1]);
                      }}
                      sx={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 40,
                        cursor: "pointer",
                        color: "#ffffff",
                        zIndex: 10,
                      }}
                    />
                  )}
                </>
              );
            })()}
        </Box>
      </Modal>
    </div>
  );
};

export default StoryField;
