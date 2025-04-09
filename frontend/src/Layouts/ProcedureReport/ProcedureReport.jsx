import { Typography, Grid2 } from "@mui/material";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";

const ProcedureReport = () => {
  const rows = [
    { id: 1, name: "John Doe", age: 28, role: "Developer" },
    { id: 2, name: "Jane Smith", age: 34, role: "Designer" },
    { id: 3, name: "Sam Wilson", age: 41, role: "Manager" },
  ];
  return (
    <div>
      <Grid2 container bgcolor={"white"} borderRadius={4} p={3}>
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} p={2}>
            Журмын биелэлтийн тайлан
          </Typography>
        </Grid2>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small">
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>
    </div>
  );
};

export default ProcedureReport;
