import * as React from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"

export default function AutoCompleteSearch({ loading = false, options = [], onChange }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 800, mt: 4 }}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(option, value) => option.nameAr === value.nameAr || option.nameEn === option.nameEn}
      getOptionLabel={(option) => option.nameAr}
      options={options}
      loading={loading}
      filterOptions={() => options}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ادخل الاسم"
          onChange={(event) => {
            if (onChange) onChange(event.target.value)
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}
