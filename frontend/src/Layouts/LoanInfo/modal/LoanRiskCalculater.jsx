import React, { useState, useEffect } from "react";
import { Grid2, Typography, Button } from "@mui/material";
import GetLoanDataById from "../../../api/GetLoanDataById";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";

const LoanRiskCalculater = ({ id, handleBack, customerData }) => {
  const [scoringData, setScoringData] = useState(null);
  const [loan, setLoan] = useState();
  const [req, setReq] = useState([]);
  const [con, setCon] = useState([]);
  const [reqScoring, setReqScoring] = useState(0);
  const [clickNumber, setClickNumber] = useState(0);
  const [reqCheck, setReqCheck] = useState([]);

  const [isApprove, setIsApprove] = useState(false);

  useEffect(() => {
    if (reqCheck && reqCheck.length) {
      const allApproved = reqCheck.every((item) => item.value === true);
      setIsApprove(allApproved);
      console.log("All approved:", allApproved);
    }
  }, [reqCheck]);

  const columns = [
    {
      label: "Зээлийн шаардлага",
      accessor: "requirement",
      flex: 10,
      headerAlign: "center",
    },
    {
      label: "Хангасан эсэх",
      accessor: "value",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        console.log(params);
        return params.value ? "Хангасан" : "Хангаагүй";
      },
    },
  ];

  const clicked = () => {
    setClickNumber(clickNumber + 1);
  };

  useEffect(() => {
    if (clickNumber === 1) {
      const fetchRequirements = async () => {
        try {
          const { status, data } = await axios.post(
            `http://localhost:5000/loan/checkLoanRequirements/${id}`,
            {
              userId: customerData._id,
            }
          );
          if (status === 200) {
            setReqCheck(
              data.filter(
                (item) =>
                  item.requirement && !item.requirement.startsWith("FICO")
              )
            );
            console.log(
              data.filter(
                (item) =>
                  item.requirement && !item.requirement.startsWith("FICO")
              )
            );
          }
        } catch (error) {
          console.error("Error fetching requirements:", error);
        }
      };
      fetchRequirements();
    }
  }, [clickNumber]);

  useEffect(() => {
    GetLoanDataById(id).then((data) => {
      if (data) {
        setLoan(data.data.loans[0]);
        setReq(data.data.requirements || []);
        setCon(data.data.conditions || []);
      } else {
        setLoan(null);
        setReq(null);
        setCon(null);
      }
    });
  }, [id]);

  useEffect(() => {
    if (customerData && customerData.Scoring) {
      setScoringData(customerData.Scoring);
    } else {
      setScoringData(false);
    }
  }, [customerData]);

  useEffect(() => {
    if (req && req.length) {
      const string = req.find((item) =>
        item.requirementName?.startsWith("FICO")
      )?.requirementName;
      setReqScoring(Number(string.match(/\d+/)?.[0]));
    }
  }, [req]);

  return (
    <Grid2
      container
      sx={{ width: 600 }}
      // pt={3}
      height={"auto"}
      display="flex"
      justifyContent="space-between"
      borderRadius={5}
      spacing={2}
    >
      {clickNumber === 0 && (
        <>
          <Grid2 size={5} display={"flex"} justifyContent={"flex-end"}>
            <Typography fontSize={16} fontWeight={"bold"}>
              Зээлийн шаардлага :
            </Typography>
          </Grid2>
          <Grid2 size={7} display={"flex"} justifyContent={"flex-start"}>
            <Typography fontSize={16}>
              {req.find((item) => item.requirementName?.startsWith("FICO"))
                ?.requirementName || "FICO requirement not found"}
            </Typography>
          </Grid2>
          <Grid2 size={5} display={"flex"} justifyContent={"flex-end"}>
            <Typography fontSize={16} fontWeight={"bold"}>
              Таны scoring :
            </Typography>
          </Grid2>
          <Grid2 size={7} display={"flex"} justifyContent={"flex-start"}>
            <Typography fontSize={16}>{scoringData?.scoring} оноо</Typography>
          </Grid2>
          <Grid2
            size={12}
            display={"flex"}
            textAlign={"center"}
            justifyContent={"center"}
          >
            <Typography
              fontSize={16}
              style={{
                color:
                  reqScoring &&
                  scoringData &&
                  scoringData?.scoring &&
                  reqScoring < scoringData?.scoring
                    ? "green"
                    : "red",
              }}
            >
              {reqScoring &&
              scoringData &&
              scoringData?.scoring &&
              reqScoring < scoringData?.scoring
                ? "Таны скоринг шаардлагыг хангаж байна. Үргэлжлүүлэх дарна уу."
                : "Таны скоринг тухайн зээлийн бүтээгдэхүүний шаардлагыг хангахгүй байгаа тул үргэжлүүлэх боломжгүй байна."}
            </Typography>
          </Grid2>
          <Grid2 size={6} display={"flex"} justifyContent={"flex-start"}>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold", height: "35px", bgcolor: "#05357E" }}
              onClick={handleBack}
            >
              Буцах
            </Button>
          </Grid2>
          <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold", height: "35px", bgcolor: "#05357E" }}
              disabled={
                !(
                  reqScoring &&
                  scoringData &&
                  scoringData?.scoring &&
                  reqScoring < scoringData?.scoring
                )
              }
              onClick={clicked}
            >
              Үргэлжлүүлэх
            </Button>
          </Grid2>
        </>
      )}
      {clickNumber === 1 && reqCheck && reqCheck.length > 0 && (
        <>
          <Grid2 size={12}>
            <CustomDataGrid columns={columns} data={reqCheck} />
          </Grid2>
          <Grid2 size={6} display={"flex"} justifyContent={"flex-start"}>
            <Button variant="contained" onClick={() => setClickNumber(0)}>
              Буцах
            </Button>
          </Grid2>
          <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
            <Button variant="contained">Үргэлжлүүлэх</Button>
          </Grid2>
        </>
      )}
    </Grid2>
  );
};

export default LoanRiskCalculater;
