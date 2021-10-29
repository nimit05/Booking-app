import React from 'react'
import styled from 'styled-components'
import Book from '../component/Book'

const Home = () => {
 
  return (
    <HomCont>
      <Book />
    </HomCont>
  )
}

const HomCont = styled.div`
  width: 100%;
`

export default Home