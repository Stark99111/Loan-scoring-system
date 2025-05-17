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
          "🎉 Маш сайн! Та энэ үзүүлэлт дээр өндөр оноо авсан байна. Ийм байдлаа хадгалаарай."
        );
      } else if (percent >= 60) {
        switch (label) {
          case "Хэрэглэгчийн анкет":
            adviceList = [
              "Таны бүрдүүлсэн анкет боломжийн сайн байна.",
            ];
            break;
          case "Одоогийн өрийн хэмжээ":
            adviceList = [
              "Таны өрийн хэмжээ дунд түвшинд байна.",
              "Шинэ зээл авахдаа анхааралтай байж, одоогийн өрөө төлж дуусгахыг хичээгээрэй.",
            ];
            break;
          case "Зээлийн түүхийн урт":
            adviceList = [
              "Зээлийн түүх дунд түвшинд байна.",
              "Тогтмол хугацаатай зээлийн төлөтийг хугацаанд нь хийх нь тус оноог өсгөнө.",
            ];
            break;
          case "Чанаргүй зээлийн түүх":
            adviceList = [
              "Таны чанаргүй зээлийн түүх багасаж байгаа нь сайн хэрэг.",
              "Шинэ зээлийн төлбөрийг хугацаанд нь төлж хэвшвэл оноо улам өснө.",
            ];
            break;
          case "Өр орлогын харьцаа":
            adviceList = [
              "Таны өр орлогын харьцаа дунд түвшинд байна.",
              "Өрийг бууруулах болон орлогоо нэмэгдүүлэх нь оноонд сайнаар нөлөөлнө.",
            ];
            break;
          default:
            adviceList = ["Сайжруулах боломж байгаа тул анхаарч үзээрэй."];
        }
      } else {
        switch (label) {
          case "Хэрэглэгчийн анкет":
            adviceList = [
              "Анкетын мэдээлэл шаардлага хангаагүй байна.",
            ];
            break;
          case "Одоогийн өрийн хэмжээ":
            adviceList = [
              "Таны өр өндөр байна. Шинэ зээлийн хүсэлт гаргахаас түр түдгэлзээрэй.",
              "Одоогийн өрөө төлж багасгахыг зорь.",
            ];
            break;
          case "Зээлийн түүхийн урт":
            adviceList = [
              "Таны зээлийн түүх богино байна.",
              "Урт хугацаанд тогтвортой зээлтэй байж, сайн төлөлт хийснээр оноо нэмэгдэх боломжтой.",
            ];
            break;
          case "Чанаргүй зээлийн түүх":
            adviceList = [
              "Чанаргүй зээлийн тоо их байна. Энэ нь таны зээлийн оноог бууруулдаг.",
              "Ирээдүйд бүх төлбөрийг хугацаанд нь төлж хэвшээрэй.",
            ];
            break;
          case "Өр орлогын харьцаа":
            adviceList = [
              "Өр орлогын харьцаа өндөр байна. Энэ нь зээл төлөх чадварт сөргөөр нөлөөлдөг.",
              "Орлогоо нэмэгдүүлэх эсвэл өрөө бууруулах алхам хийгээрэй.",
            ];
            break;
          default:
            adviceList = ["Оноогоо нэмэгдүүлэхэд анхаарах шаардлагатай байна."];
        }
      }

      return {
        label,
        value: value.toFixed(1),
        maxValue: maxValue.toFixed(1),
        percent: percent.toFixed(1),
        advice: adviceList.join(" "),
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
