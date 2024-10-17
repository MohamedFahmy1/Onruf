import React, { useEffect, forwardRef, useRef } from "react"

// eslint-disable-next-line react/display-name
const Checkbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return <input type="checkbox" ref={resolvedRef} {...rest} />
})

export default Checkbox
