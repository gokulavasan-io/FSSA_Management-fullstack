import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Dialog,
} from "@mui/material";
import { School, Subject as SubjectIcon, Close } from "@mui/icons-material";
import { useMarksContext } from "../../../../Context/MarksContext";

function TestDetailCard() {
  const { testDetailCardVisible, setTestDetailCardVisible, testDetail,isLevelTable } =useMarksContext();
  if (!testDetailCardVisible) return null;
  const formattedDate = dayjs(testDetail.created_at).format("DD/MM/YYYY");

  return (
    <Dialog
      open={testDetailCardVisible}
      onClose={() => setTestDetailCardVisible(false)}
      style={{zIndex:10000}}
    >
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#3f51b5" }}>
              <School />
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {testDetail.test_name}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {formattedDate}
            </Typography>
          }
          sx={{ backgroundColor: "#f5f5f5", textAlign: "left" }}
          action={
            <IconButton
              size="small"
              onClick={() => setTestDetailCardVisible(false)}
              sx={{ color: "gray" }}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                display="flex"
                alignItems="center"
              >
                <SubjectIcon sx={{ mr: 1 }} />
                Subject:{" "}
                <Chip
                  label={testDetail.subject}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Grid>

           {!isLevelTable &&  <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                Total Marks: {testDetail.total_marks}
              </Typography>
            </Grid>
            }

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                About Test: {testDetail.about_test || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Dialog>
  );
}

export default TestDetailCard;
