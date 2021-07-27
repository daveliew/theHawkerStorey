import React, { useState } from "react";
// import { useQuery, QueryCache } from "react-query";
// import axios from "axios";
import AutocompleteHC from "./Post/AutocompleteHC";
import AutocompleteHS from "./Post/AutocompleteHS";
import AutocompleteDishes from "./Post/AutocompleteDishes";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core/";
// import { Autocomplete, Rating } from "@material-ui/lab/";
import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Post({ handleClosePost }) {
  const classes = useStyles();

  const [hawkerCentre, setHawkerCentre] = useState("");
  const [hawkerStall, setHawkerStall] = useState("");
  const [image, setImage] = useState("");
  const [dishName, setDishName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(4);

  const handleSubmit = (e) => {
    e.preventDefault();

    //* code for image upload
    const reader = new FileReader();

    reader.readAsDataURL(image);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      console.error("Something went wrong");
    };

    handleClosePost();
  };

  //* convert image binary into string (base64EndcodedImage) and calls fetch route
  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("/v1/posts/upload", {
        method: "POST",
        body: JSON.stringify({
          data: base64EncodedImage,
          hawkerCentre: hawkerCentre,
          hawkerStall: hawkerStall,
          review: review,
          rating: rating,
          dishes_id: dishName,
        }),
        headers: { "Content-Type": "application/json" },
      });
      setImage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.paper}>
      <React.Fragment>
        <Typography variant="h4" gutterBottom>
          Add New Post
        </Typography>
        {/* ====================MATERIAL UI Autocomplete for hawkerCentre option selection: pairs to hawkerCentreData==================== */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AutocompleteHC setHawkerCentre={setHawkerCentre} />
          </Grid>
          {/* ====================MATERIAL UI Autocomplete for hawkerStall option selection: pairs to hawkerStallsDATA==================== */}
          <Grid item xs={12} md={6}>
            {hawkerCentre && (
              <AutocompleteHS
                hawkerCentre={hawkerCentre}
                setHawkerStall={setHawkerStall}
              />
            )}
          </Grid>
          {/* ====================MATERIAL UI Autocomplete for dishes=================== */}
          <Grid item xs={12}>
            {hawkerStall && (
              <AutocompleteDishes
                hawkerCentre={hawkerCentre}
                hawkerStall={hawkerStall}
                setDishName={setDishName}
              />
            )}
          </Grid>
          {/* ====================MATERIAL UI DROPZONE for image uploading: pairs to Cloudinary==================== */}
          <Grid item xs={12}>
            <DropzoneArea
              acceptedFiles={["image/*"]}
              dropzoneText={"Drag and drop an image here or click"}
              filesLimit={1}
              onChange={(files) => {
                setImage(files[0]);
              }}
            />
          </Grid>
          {/* ====================MATERIAL UI Textfield for user to write reviews=================== */}
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Review"
              multiline
              rows={4}
              style={{ width: "100%" }}
              variant="outlined"
              onChange={(event) => {
                setReview(event.target.value);
              }}
            />
          </Grid>
          {/* ====================MATERIAL UI Rating for users to select review=================== */}
          <Grid item xs={12}>
            {/* <Rating
              size="large"
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            /> */}
            <Box textAlign="right">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    </div>
  );
}
