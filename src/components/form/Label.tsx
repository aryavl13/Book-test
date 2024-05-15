import React from 'react'
interface LabelProps{
    label : string
}
const Label:React.FC<LabelProps> = ({label}) => {
  return (
    <label className="block text-gray-500 font-medium text-sm leading-none mb-2">
      {label}
    </label>
  )
}

export default Label