import React, { useEffect, useState } from "react";
import {
  Grid2,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CustomModal from "../../../Components/CustomModal";
import CustomerMainInformation from "./tabs/MainInformation";

ChartJS.register(ArcElement, Tooltip, Legend);

const CalculateScoring = () => {
  const [isScoringCalculated, setIsScoringCalculated] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [customerMainInfoModal, setCustomerMainInfoModal] = useState(false);

  useEffect(() => {
    if (!isScoringCalculated) {
      setApproveModal(true);
    }
  }, [isScoringCalculated]);

  const CalculateScoringData = () => {
    return (
      <>
        <Grid2 container spacing={2} p={1} borderRadius={4}>
          <Grid2 size={12}>
            <Typography fontSize={16} lineHeight={1.7} textAlign={"justify"}>
              1. Зээлжих зэрэглэлийн оноо (scoring) тооцоолох зорилгоор таны
              хувийн мэдээллийг дотоод өгөгдлийн санд хадгалж, тооцоолол хийхэд
              ашиглахыг зөвшөөрж байна.
            </Typography>
          </Grid2>

          <Grid2 size={12}>
            <Typography fontSize={16} lineHeight={1.7} textAlign={"justify"}>
              2. Энэхүү мэдээлэл нь зөвхөн дотоод хэрэгцээнд ашиглагдах бөгөөд
              гуравдагч этгээдэд дамжуулахгүй болно.
            </Typography>
          </Grid2>

          <Grid2 size={12} display="flex" justifyContent="center">
            <FormControlLabel
              sx={{
                mt: 1,
                border: "1px solid #d1d5db",
                borderRadius: 2,
                px: 2,
                py: 1,
                bgcolor: "#f9fafb",
              }}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography fontSize={15}>
                  Би дээрх нөхцөлийг зөвшөөрч байна.
                </Typography>
              }
            />
          </Grid2>

          <Grid2 size={12} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={!isChecked}
              sx={{ minWidth: 160 }}
              onClick={() => {
                setApproveModal(false);
                setCustomerMainInfoModal(true);
              }}
            >
              Үргэлжлүүлэх
            </Button>
          </Grid2>
        </Grid2>
      </>
    );
  };

  const data = {
    labels: ["Savings", "Loan", "Investment", "Expense", "test"],
    datasets: [
      {
        label: "My Data",
        data: [250, 300, 300, 200, 150],
        backgroundColor: [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#00C49F",
        ],
        borderWidth: 1,
      },
    ],
  };

  {
    return (
      <div>
        <Grid2
          container
          bgcolor={"white"}
          borderRadius={4}
          p={3}
          gap={3}
          display={"flex"}
        >
          <Grid2 size={12}>
            <Typography fontWeight={"bold"} fontSize={23} pt={2} pl={3}>
              Зээлжих зэрэглэлийн оноо (скоринг)
            </Typography>
          </Grid2>

          {isScoringCalculated ? (
            <>
              {/* Left Column - Details */}
              <Grid2
                size={4.3}
                container
                display={"flex"}
                justifyContent={"center"}
                spacing={2}
              >
                <Grid2 size={12} display={"flex"} justifyContent={"center"}>
                  <Typography
                    fontSize={18}
                    sx={{ textDecoration: "underline" }}
                  >
                    Онооны дэлгэрэнгүй жагсаалт
                  </Typography>
                </Grid2>
                <Grid2 size={10}>
                  <ul>
                    {Array(7)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </li>
                      ))}
                  </ul>
                </Grid2>
              </Grid2>

              {/* Center - Chart */}
              <Grid2
                size={3}
                container
                spacing={4}
                p={2}
                display="flex"
                justifyContent="center"
                borderRadius={3}
                bgcolor={"#e9ecf2"}
              >
                <Grid2 size={12}>
                  <Typography
                    fontSize={24}
                    fontWeight="bold"
                    display="flex"
                    justifyContent="center"
                  >
                    Нийт оноо : 600 (Сайн)
                  </Typography>
                </Grid2>
                <Grid2 size={10}>
                  <Pie data={data} />
                </Grid2>
              </Grid2>

              {/* Right Column - Recommendations */}
              <Grid2
                size={4.3}
                display={"flex"}
                justifyContent={"center"}
                container
                spacing={2}
              >
                <Grid2 size={12} display={"flex"} justifyContent={"center"}>
                  <Typography
                    fontSize={18}
                    sx={{ textDecoration: "underline" }}
                  >
                    Сайжруулах боломж
                  </Typography>
                </Grid2>
                <Grid2 size={10}>
                  <ul>
                    {Array(7)
                      .fill(null)
                      .map((_, i) => (
                        <li key={i}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </li>
                      ))}
                  </ul>
                </Grid2>
              </Grid2>

              <Grid2 size={12} display={"flex"} justifyContent={"flex-end"}>
                <Button
                  variant="contained"
                  onClick={() => setApproveModal(true)}
                >
                  Зэрэглэл бодуулах
                </Button>
              </Grid2>
            </>
          ) : (
            <>
              {approveModal && customerMainInfoModal ? (
                <Grid2 size={12} display={"flex"} justifyContent={"center"}>
                  <Button
                    variant="contained"
                    onClick={() => setApproveModal(true)}
                  >
                    Зэрэглэл тооцоолуулах
                  </Button>
                </Grid2>
              ) : null}
            </>
          )}
        </Grid2>
        <CustomModal
          open={approveModal}
          onClose={() => setApproveModal(false)}
          title={"Зөвшөөрлийн хуудас"}
        >
          <Box sx={{ width: 600, borderRadius: 3 }}>
            <CalculateScoringData />
          </Box>
        </CustomModal>
        <CustomModal
          open={customerMainInfoModal}
          onClose={() => setCustomerMainInfoModal(false)}
          title={"Үндсэн мэдээлэл"}
        >
          <Box sx={{ width: 1200, borderRadius: 3 }}>
            <CustomerMainInformation />
          </Box>
        </CustomModal>
      </div>
    );
  }
};

export default CalculateScoring;
