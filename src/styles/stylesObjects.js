export const priceSpansStyle = (locale) => {
  if (locale === "en") {
    return { borderRadius: "0 50px 50px 0" }
  } else return { borderRadius: "50px 0 0 50px" }
}
export const priceInputsStyle = (locale) => {
  if (locale === "en") {
    return { borderRadius: "50px 0 0 50px" }
  } else return { borderRadius: "0 50px 50px 0" }
}
export const textAlignStyle = (locale) => {
  return { textAlign: locale === "en" ? "left" : "right" }
}
export const flexDirectionStyle = (locale) => {
  return { flexDirection: locale === "en" ? "row" : "row-reverse" }
}
