import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const AutocompleteHS = ({ hawkerCentre, setHawkerStall }) => {
  console.log("hello from Autocomplete", hawkerCentre);
  const test = hawkerCentre;
  console.log(test);

  // Fetching of hawker stalls
  const { data } = useQuery("hawkerstalls", () =>
    axios(`v1/hawkers/maxwell-food-centre/`)
  );
  // find out why it doesn't fetch

  const stallNames = data?.data?.hawker_stalls;
  console.log("stallnames", stallNames);
  const hsList = stallNames?.map((stall) => {
    return stall.name;
  });
  return (
    <>
      <Autocomplete
        id="Hawker Stall"
        options={hsList}
        getOptionLabel={(option) => option}
        onChange={(event, newValue) => {
          setHawkerStall(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Hawker Stall" variant="outlined" />
        )}
      />
    </>
  );
};

export default AutocompleteHS;
