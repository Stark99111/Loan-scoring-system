import React, { useRef } from "react";
import { Box, IconButton, Grid2, Typography } from "@mui/material";
import StoryField from "./tabs/StoryField";
import Divider from "@mui/material/Divider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import StarRateIcon from "@mui/icons-material/StarRate";

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
          Санхүүгийн мэдээллээ тогтмол хянаж, оноогоо дээшлүүлээрэй!
        </Typography>
      </Grid2>
      <Grid2
        size={12}
        display={"flex"}
        justifyContent={"center"}
        direction={"row"}
        pb={1}
      >
        <Typography fontSize={15} width={"80%"} textAlign={"center"}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fugit
          veritatis minus, voluptates eveniet eos rem ad consequuntur aut,
          facere incidunt doloremque id ea, magnam a illo dolore autem
          voluptatum reiciendis error commodi aliquam molestiae. Necessitatibus
          laborum nesciunt harum nobis perspiciatis corporis dolore voluptatibus
          quas quod dolores quaerat architecto vel accusamus sapiente, et
          tenetur dolor reiciendis earum quis. Soluta, reiciendis?
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
          <Typography fontSize={22} textAlign={"center"}>
            Давуу тал
          </Typography>
        </Grid2>
        <Grid2 size={6}>
          <IconButton sx={{ width: "30%" }}>
            <StarRateIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6}>
          <IconButton sx={{ width: "30%" }}>
            <ThumbUpIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6}>
          <Typography textAlign={"justify"} fontSize={20} width={"75%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Typography>
        </Grid2>
        <Grid2 size={6}>
          <Typography textAlign={"justify"} fontSize={20} width={"75%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Typography>
        </Grid2>
        <Grid2 size={6} pb={2}>
          <Typography textAlign={"justify"} width={"90%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatibus itaque aspernatur iure quae, vero illo amet sunt
            provident sit natus perferendis corporis similique in excepturi
            exercitationem ducimus velit expedita voluptate nam porro! Non
            provident quos, at nobis perspiciatis culpa sequi delectus cumque,
            nisi labore dolorem est! Ratione est voluptatum voluptas.
          </Typography>
        </Grid2>
        <Grid2 size={6} pb={2}>
          <Typography textAlign={"justify"} width={"90%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatibus itaque aspernatur iure quae, vero illo amet sunt
            provident sit natus perferendis corporis similique in excepturi
            exercitationem ducimus velit expedita voluptate nam porro! Non
            provident quos, at nobis perspiciatis culpa sequi delectus cumque,
            nisi labore dolorem est! Ratione est voluptatum voluptas.
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
          <Typography fontSize={22} textAlign={"center"}>
            Боломжууд
          </Typography>
        </Grid2>
        <Grid2 size={6}>
          <IconButton sx={{ width: "30%" }}>
            <EmojiEmotionsIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6}>
          <IconButton sx={{ width: "30%" }}>
            <EmojiObjectsIcon sx={{ fontSize: "45px" }} color="primary" />
          </IconButton>
        </Grid2>
        <Grid2 size={6}>
          <Typography textAlign={"justify"} fontSize={20} width={"75%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Typography>
        </Grid2>
        <Grid2 size={6}>
          <Typography textAlign={"justify"} fontSize={20} width={"75%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Typography>
        </Grid2>
        <Grid2 size={6} pb={2}>
          <Typography textAlign={"justify"} width={"90%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatibus itaque aspernatur iure quae, vero illo amet sunt
            provident sit natus perferendis corporis similique in excepturi
            exercitationem ducimus velit expedita voluptate nam porro! Non
            provident quos, at nobis perspiciatis culpa sequi delectus cumque,
            nisi labore dolorem est! Ratione est voluptatum voluptas.
          </Typography>
        </Grid2>
        <Grid2 size={6} pb={2}>
          <Typography textAlign={"justify"} width={"90%"} ml={2}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatibus itaque aspernatur iure quae, vero illo amet sunt
            provident sit natus perferendis corporis similique in excepturi
            exercitationem ducimus velit expedita voluptate nam porro! Non
            provident quos, at nobis perspiciatis culpa sequi delectus cumque,
            nisi labore dolorem est! Ratione est voluptatum voluptas.
          </Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default Default;
