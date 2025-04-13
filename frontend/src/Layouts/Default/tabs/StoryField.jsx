import React, { useRef, useState } from "react";
import StoryCircle from "../../../Components/StoryCircle";
import "./StoryField.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { IconButton } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Grid2, Typography } from "@mui/material";

const ITEM_WIDTH = 200;

const StoryField = ({ content }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef();

  const stories = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleScroll = (scrollAmount) => {
    const newScrollPosition = scrollPosition + scrollAmount * 2;

    setScrollPosition(newScrollPosition);

    containerRef.current.scrollLeft = newScrollPosition;
  };

  const currencyToMNT = [
    { code: "USD", name: "US Dollar", rate: 3480 },
    { code: "EUR", name: "Euro", rate: 3750 },
    { code: "GBP", name: "British Pound", rate: 4350 },
    { code: "CNY", name: "Chinese Yuan", rate: 480 },
    { code: "JPY", name: "Japanese Yen", rate: 23 },
    { code: "KRW", name: "South Korean Won", rate: 2.6 },
    { code: "RUB", name: "Russian Ruble", rate: 37 },
    { code: "CAD", name: "Canadian Dollar", rate: 2550 },
    { code: "AUD", name: "Australian Dollar", rate: 2350 },
    { code: "CHF", name: "Swiss Franc", rate: 3900 },
    { code: "INR", name: "Indian Rupee", rate: 42 },
    { code: "HKD", name: "Hong Kong Dollar", rate: 445 },
    { code: "SGD", name: "Singapore Dollar", rate: 2580 },
    { code: "THB", name: "Thai Baht", rate: 97 },
    { code: "SEK", name: "Swedish Krona", rate: 330 },
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
      <div className="action-btns ">
        <button onClick={() => handleScroll(-ITEM_WIDTH)}>
          <ArrowLeftIcon fontSize="large" />
        </button>
      </div>
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
          {content === "story" ? (
            <>
              {stories.map((num) => (
                <div className="card">
                  <StoryCircle index={num} key={num} />
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
          {content === "currency" ? (
            <>
              {currencyToMNT.map((item, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: 180,
                    maxWidth: 200,
                    marginRight: 16,
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 16,
                    background: "linear-gradient(135deg, #f7faff, #e2ecf6)",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "0.3s",
                  }}
                >
                  <Typography variant="h6" fontWeight={500}>
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
                    ₮ {item.rate.toLocaleString()}
                  </Typography>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="action-btns ">
        <button onClick={() => handleScroll(ITEM_WIDTH)}>
          <ArrowRightIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};

export default StoryField;
