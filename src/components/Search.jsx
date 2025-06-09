import React from 'react'
import searchIcon from "../assets/search.svg"

const Search = (props) => {
  return (
    <div className='search'>
        <div>
            <img src={searchIcon} alt="search" />
            <input type="text"
                   placeholder='Search through thousands of movies'
                   value={props.searchTerm}
                   onChange={(event) => props.setSearchTerm(event.target.value)}/>
        </div>
    </div>
  )
}

export default Search