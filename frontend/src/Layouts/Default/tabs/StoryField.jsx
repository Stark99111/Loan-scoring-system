import React, { useRef, useEffect, useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StoryCircle from "../../../Components/StoryCircle";
import "./StoryField.css";
import { Typography } from "@mui/material";

const ITEM_WIDTH = 200;

const StoryField = ({ content }) => {
  const containerRef = useRef();
  const [isPaused, setIsPaused] = useState(false);

  const stories = Array.from({ length: 50 }, (_, i) => i + 1);

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

  // 🔁 Auto-scroll with pause logic
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (!isPaused && containerRef.current) {
        containerRef.current.scrollLeft += 1;
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  // ⏸ Pause auto-scroll when button is clicked
  const handleScroll = (scrollAmount) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollAmount;

      setIsPaused(true);
      // Resume auto-scroll after 3 seconds
      setTimeout(() => setIsPaused(false), 3000);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div className="action-btns">
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
          {content === "story" &&
            stories.map((num) => (
              <div className="card" key={num}>
                <StoryCircle index={num} />
              </div>
            ))}
          {content === "currency" &&
            currencyToMNT.map((item, index) => (
              <div
                key={index}
                style={{
                  minWidth: 180,
                  maxWidth: 200,
                  marginRight: 16,
                  border: "1px solid rgb(75, 71, 71)",
                  borderRadius: 12,
                  padding: 16,
                  // background: "linear-gradient(135deg, #f7faff, #e2ecf6)",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "0.3s",
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  {item.code}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₮ {item.rate.toLocaleString()}
                </Typography>
              </div>
            ))}
        </div>
      </div>
      <div className="action-btns">
        <button onClick={() => handleScroll(ITEM_WIDTH)}>
          <ArrowRightIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};

export default StoryField;
