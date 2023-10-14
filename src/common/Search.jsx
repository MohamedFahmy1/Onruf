import React, { useState } from "react"
import { Button, Stack, TextField } from "@mui/material"

const Search = (props) => {
  const [enteredText, setEnteredText] = useState("")

  const handleChange = (e) => {
    setEnteredText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    enteredText && props.onSubmit(enteredText)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} marginTop={3}>
        <Stack width={671}>
          <TextField
            placeholder="اكتب اسم السلعه"
            onChange={handleChange}
            variant="filled"
            sx={
              {
                // backgroundColor: "red",
                // borderRadius: 50,
              }
            }
          />
        </Stack>
        <Button
          variant="contained"
          type="submit"
          sx={{
            borderRadius: 0,
          }}
        >
          Search
        </Button>
      </Stack>
    </form>
  )
}

export default Search
