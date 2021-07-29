import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import AutocompleteHC from "./Post/AutocompleteHC";
import AutocompleteHS from "./Post/AutocompleteHS";
import AutocompleteDishes from "./Post/AutocompleteDishes";

import {
  makeStyles,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab/";
import { DropzoneArea } from "material-ui-dropzone";

import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  exit: {
    color: " red",
    float: "right",
  },
}));

export default function Post({ userState, handleClosePost }) {
  const classes = useStyles();
  //! userState not passed by context somehow
  // const userState = useContext(AuthContext);
  console.log(userState.username);

  const [hawkerCentre, setHawkerCentre] = useState("");
  const [hawkerStall, setHawkerStall] = useState("");
  const [image, setImage] = useState("");
  const [dishName, setDishName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("3");

  const handleRating = (event, newRating) => {
    setRating(newRating);
    console.log(rating);
  };

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
          username: userState.username,
          user_id: userState.user_id,
          hawkerCentre: hawkerCentre,
          hawkerStall: hawkerStall,
          review: review,
          rating: rating,
          dishes_name: dishName,
        }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) => {
        console.log("Post submitted", res.data);
        setImage("");
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.paper}>
      <React.Fragment>
        <Typography variant="h4" gutterBottom>
          Add New Post
          <Button className={classes.exit} onClick={handleClosePost}>
            <CloseIcon className={classes.exit} />
          </Button>
        </Typography>

        {/* ====================MATERIAL UI Autocomplete for hawkerCentre option selection: pairs to hawkerCentreData==================== */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AutocompleteHC
              setHawkerCentre={setHawkerCentre}
              setHawkerStall={setHawkerStall}
              setDishName={setDishName}
            />
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
            <ToggleButtonGroup
              value={rating}
              exclusive
              onChange={handleRating}
              aria-label="text alignment"
            >
              <ToggleButton value="3">
                <Typography>MUST GO!</Typography>
              </ToggleButton>

              <ToggleButton value="2">
                <Typography>CAN GO!</Typography>
              </ToggleButton>

              <ToggleButton value="1">
                <Typography>NO GO!</Typography>
              </ToggleButton>
            </ToggleButtonGroup>

            <Box textAlign="right">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
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
