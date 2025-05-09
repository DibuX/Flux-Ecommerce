import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  let inputClass = "input"

  // Añadir clases adicionales
  if (className) inputClass += " " + className

  return <input type={type} className={inputClass} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }
