import { ListItemButton, styled } from "@mui/material"

export const StyledListButton = styled(ListItemButton)(({ theme, selected }) => {
  return `
      font-size: 18px;
      border-radius: 50px;
      padding: 13px 20px;
      display: flex;
      margin: 5px auto;
      align-items: center;
      gap: 10px;
      transform: all 0.3s linear 0s;
      position: relative;
      width: 214px; 
      align-items: flex-end;
      color: black;
     &:hover {
          background-color: ${!selected ? theme.palette.primary.main : "transparent"};
          color: white;
          box-shadow: 0px 0px 10px 0px #ee6c4db3; 
          }
          
      &.Mui-selected {
        background-color: ${theme.palette.primary.main};
        box-shadow: 0px 0px 10px 0px #ee6c4db3; 
        color: white;
        }
      

  `
})

export const IconsWrapper = styled("span")(({ selected }) => ({
  width: "25px",
  height: "25px",
  position: "relative",
  overflow: "hidden",
}))
