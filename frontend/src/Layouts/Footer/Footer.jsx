import React from "react";
import { Box, Grid2, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Grid2
      container
      // bgcolor="white"
      // borderRadius={5}
      pl={5}
      pr={5}
      direction={"row"}
      justifyContent={"space-around"}
      spacing={2}
    >
      <Grid2 size={4}>
        <Typography variant="h6" fontWeight={600} gutterBottom width={"80%"}>
          Зээлийн онооны систем
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }} width={"80%"}>
          Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Сөүлийн
          гудамж, Соёмбо Тауэр, A блок, 23 давхар, #2303
        </Typography>
        <Box>
          <IconButton href="#" target="_blank" sx={{ color: "#000000" }}>
            <FacebookIcon />
          </IconButton>
          <IconButton href="#" target="_blank" sx={{ color: "#000000" }}>
            <LinkedInIcon />
          </IconButton>
          <IconButton href="#" target="_blank" sx={{ color: "#000000" }}>
            <InstagramIcon />
          </IconButton>
        </Box>
      </Grid2>

      {/* Column 2 */}
      <Grid2 size={3}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Үйлчилгээ
        </Typography>
        {["Зээлийн лавлагаа", "Өр, орлогын харьцаа", "FICO® Score"].map(
          (text, index) => (
            <Typography key={index} variant="body2" sx={{ my: 0.5 }}>
              {text}
            </Typography>
          )
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Нууцлалын бодлого
        </Typography>
      </Grid2>

      {/* Column 3 */}
      <Grid2 size={3}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Холбоосууд
        </Typography>
        {["Бидний тухай", "Холбоо барих", "Санал хүсэлт"].map((text, index) => (
          <Typography key={index} variant="body2" sx={{ my: 0.5 }}>
            {text}
          </Typography>
        ))}
        <Typography variant="body2" sx={{ mt: 2 }}>
          МАБ-ын бодлого
        </Typography>
      </Grid2>

      {/* Column 4 */}
      <Grid2 size={2}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Холбоо барих
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          (+976) 8624-1199
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          info@creditScoring-system.mn
        </Typography>
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="body2" align="center" color="gray">
          © creditScoring {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" align="center" color="gray">
          https://creditScoring-system.mn
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default Footer;
