import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const AccordionItem = ({ title, isExpanded, handleChange, children }) => {
  return (
    <Accordion expanded={isExpanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
        <Typography variant={"h5"}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={''}>{children}</AccordionDetails>
    </Accordion>
  )
}

export default AccordionItem