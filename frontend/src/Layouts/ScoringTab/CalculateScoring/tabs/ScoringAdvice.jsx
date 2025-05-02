import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomDataGrid from "../../../../Components/CustomDataGrid"; // Assuming this is your DataGrid component

const ScoringAdvice = ({ components }) => {
  const [scoringDesc, setScoringDesc] = useState([]);

  const generateScoringAdvice = (components) => {
    return components.map(({ label, value, maxValue }) => {
      const percent = (value / maxValue) * 100;
      let adviceList = [];

      if (percent >= 90) {
        adviceList.push(
          "🎉 Маш сайн! Та энэ үзүүлэлт дээр өндөр оноо авсан байна."
        );
      } else if (percent >= 60) {
        switch (label) {
          case "Зээлийн түүх":
            adviceList = [
              "Та зээл авч төлсөн туршлагатай боловч энэ нь өндөр оноо авахаар урт хугацаанд биш байна",
              "Шинэ зээл авч, хугацаанд нь төлвөл оноо сайжирна.",
              "Хугацаанд нь зээлээ эргүүлэн төлж  байгаарай.",
            ];
            break;
          case "Одоогийн өрийн хэмжээ":
            adviceList = [
              "Таны өр дунд түвшинд байгаа тул илүү их эрсдэл гаргахгүй байх нь чухал.",
              "Цаг тухайд нь зээлийн үлдэгдлээ төлж дуусах нь зээлжих зэрэглэлийн оноог сайжруулна.",
            ];
            break;
          case "Зээлийн түүхийн урт":
            adviceList = [
              "Таны зээлийн түүх дунд түвшинд байна.",
              "Идэвхитэй зээлийн үлдэгдүүдээ хугацаанд нь төлбөл оноонд эерэгээр нөлөөлнө.",
            ];
            break;
          case "Шинэ зээлийн хүсэлт":
            adviceList = [
              "Та сүүлийн 6 сард хэд хэдэн хүсэлт бүртгүүлсэн байна.",
              "Ирэх саруудад зээлийн хүсэлт үүсгэхээс түр зайлсхийх хэрэгтэй.",
            ];
            break;
          case "Өр орлогын харьцаа":
            adviceList = [
              "Таны өр орлогын харьцаа дунд түвшинд байна. Энэ нь эрсдэлтэй байж болзошгүй.",
              "Орлогоо нэмэгдүүлэх, эсвэл зээлийн өрөө багасгах нь оноонд эерэг нөлөөтэй.",
            ];
            break;
          default:
            adviceList = ["Сайжруулах боломж байна."];
        }
      } else {
        switch (label) {
          case "Зээлийн түүх":
            adviceList = [
              "Зээлийн эргэн төлөлтөө хугацаанд нь төлж байгаарай.",
            ];
            break;
          case "Одоогийн өрийн хэмжээ":
            adviceList = ["Одоогийн өрийн хэмжээгээ багасгахыг хичээгээрэй."];
            break;
          case "Зээлийн түүхийн урт":
            adviceList = [
              "Зээлээ түүхийн урт их байх нь зээлийн оноонд сайнаар нөлөөлнө.",
            ];
            break;
          case "Шинэ зээлийн хүсэлт":
            adviceList = [
              "Сүүлийн үед олон зээлийн хүсэлт гаргасан бол түр азнаарай.",
            ];
            break;
          case "Өр орлогын харьцаа":
            adviceList = ["Орлого нэмэх эсвэл өр багасгах нь тус болно."];
            break;
          default:
            adviceList = ["Сайжруулах боломж байна."];
        }
      }

      return {
        label,
        value: value.toFixed(1),
        maxValue: maxValue.toFixed(1),
        percent: percent.toFixed(1),
        advice: adviceList.join(", "), // Join the advice into a single string for the table
      };
    });
  };

  useEffect(() => {
    if (components && components.length > 0) {
      const formattedData = generateScoringAdvice(components);
      console.log(formattedData);
      setScoringDesc(formattedData); // Set the generated data to state
    }
  }, [components]);

  // Define columns for the table
  const scoringValueCol = [
    { accessor: "label", label: "Үзүүлэлт", flex: 1 },
    { accessor: "value", label: "Оноо", flex: 1 },
    { accessor: "maxValue", label: "Дээд оноо", flex: 1 },
    { accessor: "percent", label: "Хувь", flex: 1 },
    { accessor: "advice", label: "Зөвлөмж", flex: 5 },
  ];

  return (
    <Box>
      <CustomDataGrid columns={scoringValueCol} data={scoringDesc} />
    </Box>
  );
};

export default ScoringAdvice;
