import { useStateUseSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import React from 'react'

const Categories = () => {
  const graphqldata = useStateUseSelector((state:RootState)=>state.home.graphqlData)
  console.log(graphqldata,"dataa");
  
  return (
    <div>
    <h2>Categories:</h2>
    {graphqldata ? (
      <ul>
        {graphqldata.categories.map(category => (
          <li key={category.id}>
            ID: {category.id}, Name: {category.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>No categories available</p>
    )}
  </div>
  )
}

export default Categories