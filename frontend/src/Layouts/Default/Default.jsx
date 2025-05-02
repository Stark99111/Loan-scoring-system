import React, { useRef } from "react";
import { IconButton, Grid2, Typography } from "@mui/material";
import StoryField from "./tabs/StoryField";
import Divider from "@mui/material/Divider";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const currencyToMNT = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KRW", name: "South Korean Won" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "INR", name: "Indian Rupee" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "THB", name: "Thai Baht" },
  { code: "SEK", name: "Swedish Krona" },
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
        currency.rate = 3480;
      } else {
        const usdToCode = data.rates[currency.code];
        const usdToMNT = 3480; // Use your static USD-MNT or pull from local bank
        currency.rate = usdToCode ? (usdToMNT / usdToCode).toFixed(2) : null;
      }
    });

    console.log(currencyToMNT);
  } catch (err) {
    console.error("Error fetching rates:", err);
  }
}

updateRates();

const Default = () => {
  return (
    <Grid2
      container
      bgcolor="white"
      borderRadius={4}
      p={3}
      direction={"row"}
      justifyContent={"space-around"}
      spacing={2}
    >
      <Grid2
        id="scrollbarStory"
        size={12}
        sx={{
          bgcolor: "grey.100",
        }}
        borderRadius={5}
      >
        <StoryField content={"story"} />
      </Grid2>

      <Grid2 size={12}>
        <Divider />
      </Grid2>
      <Grid2 size={12} display={"flex"} justifyContent={"center"}>
        <Typography fontSize={20}>
          Та зээлжих зэрэглэлээ тогтоолгосон уу?
        </Typography>
      </Grid2>
      <Grid2 size={12} display={"flex"} justifyContent={"center"}>
        <Typography
          fontSize={30}
          fontWeight={"bold"}
          width={"45%"}
          textAlign={"center"}
        >
          Санхүүгийн мэдээллээ тогтмол хянаж, скорингоо дээшлүүлээрэй!
        </Typography>
      </Grid2>
      <Grid2
        size={12}
        display={"flex"}
        justifyContent={"center"}
        direction={"row"}
        pb={2}
      >
        <Typography
          fontSize={18}
          width={"70%"}
          textAlign={"center"}
          // textAlign={"justify"}
        >
          Зээлийн онооны систем нь зээлийн мэдээллийн сангаас иргэн бүр өөрийн
          зээл төлбөрийн одоогийн болон түүхэн
          <span style={{ color: "#1174f5" }}> мэдээллээ шалгаж </span>, банк
          болон санхүүгийн байгууллагууд таны зээл, төлбөрийн ямар мэдээлэлд
          үндэслэн
          <span style={{ color: "#1174f5" }}> шийдвэр гаргаж </span> байгааг
          хянахаас гадна өөрт ямар санхүүгийн боломж байгааг хялбар, шуурхай
          мэдэж болно.
        </Typography>
      </Grid2>
      <Grid2
        size={6}
        container
        direction={"row"}
        borderRadius={4}
        sx={{
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Grid2 size={12}>
          <Typography
            fontSize={24}
            textAlign={"center"}
            ml={2}
            mt={2}
            fontWeight={"500"}
          >
            Давуу тал
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <IconButton>
            <StarBorderIcon sx={{ fontSize: 45 }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <IconButton>
            <ThumbUpOffAltIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <Typography textAlign={"center"} fontSize={20} width={"50%"} ml={2}>
            Зээлийн мэдээллээ шалгах, хянах
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <Typography textAlign={"center"} fontSize={20} width={"50%"} ml={2}>
            Зээлийн мэдээллээ сайжруулах
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"} pb={2}>
          <Typography textAlign={"center"} width={"90%"} ml={2} color="grey">
            Зээлийн мэдээлэл нь таны санхүүгийн хариуцлагыг илтгэдэг бөгөөд
            зээлийн шийдвэр гаргалтад чухал нөлөөтэй тул үнэн, зөв байлгах нь
            чухал юм.
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"} pb={2}>
          <Typography textAlign={"center"} width={"90%"} ml={2} color="grey">
            Зээлийн онооны систем таныг зээлийн сайн түүх бүтээн, өөрийн
            үнэлэмж, үнэ цэнийг өсгөх, мөрөөдлөө бодит болгох аялалд тань
            тусална.
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2
        size={6}
        container
        direction={"row"}
        borderRadius={4}
        sx={{
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Grid2 size={12}>
          <Typography fontSize={22} textAlign={"center"} mt={2}>
            Боломжууд
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <IconButton>
            <SentimentSatisfiedAltIcon
              sx={{ fontSize: "45px" }}
              color="primary"
            />
          </IconButton>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <IconButton>
            <ModeOfTravelIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <Typography textAlign={"center"} fontSize={20} width={"50%"} ml={2}>
            Байршил, цаг хугацаа үл хамаарах
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"}>
          <Typography textAlign={"center"} fontSize={20} width={"50%"} ml={2}>
            Санхүүгийн зөвлөгөө авах
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"} pb={2}>
          <Typography textAlign={"center"} width={"90%"} ml={2} color="grey">
            Зээлжих зэрэглэлийн оноогоо хүссэн цагтаа байгаа газраасаа бодуулах,
            өөрийн санхүүгийн боломжид тохирсон зээлийн мэдээлэл авах боломж
          </Typography>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"center"} pb={2}>
          <Typography textAlign={"center"} width={"90%"} ml={2} color="grey">
            Зээлжих зэрэглэлийн оноог өсгөх хувилбарыг санал болгосноор
            хэрэглэгчид санхүүгийн мэдлэг, сахилга баттай болн
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2
        id="scrollbarStory"
        size={12}
        sx={{
          bgcolor: "grey.100",
        }}
        borderRadius={5}
      >
        <StoryField content={"currency"} />
      </Grid2>
    </Grid2>
  );
};

export default Default;
