import * as React from "react";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";

const NumericFormatAdapter = React.forwardRef(function NumericFormatAdapter(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      thousandSeparator
      allowNegative={false}
      decimalScale={0}
      customInput={TextField}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
});
