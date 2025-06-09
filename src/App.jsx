import React, { useEffect, useState } from 'react'
import hero from './assets/hero.png'; 
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use'
import { updateSearchCount } from './appwrite';

// api base url
const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm,setSearchTerm] = useState('')

  const [errorMessage,setErrorMessage] = useState('')

  const [movies,setMovies] = useState([])

  const [isLoading,setIsLoading] = useState(false)

  const [debouncedSearchTerm ,setDebouncedSearchTerm] = useDebounce('')

  useDebounce(() => {
  fetchMovies(searchTerm)
}, 1000, [searchTerm]);


  const fetchMovies = async(query = '') => {

    setIsLoading(true)
    setErrorMessage('')

    try{
      const endpoint =  query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint,API_OPTIONS)

      if(!response.ok){
        throw new Error('failed to fetch movies')
      }

      const data = await response.json()

      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovies([])
        return
      }

      setMovies(data.results || [])

      if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0])
      }
    }
    catch (error){
      console.log(error)
    }

    finally{
      setIsLoading(false)
    }
  }
  // useEffect(() => { 
  //   fetchMovies(searchTerm)
  // },[searchTerm]) 

  return (
    <main>
      <div className='pattern'>

      </div>
      <div className='wrapper'>
        <header>
          <img src={hero} alt="Hero Banner"/>
          <h1>Find<span className='text-gradient'> Movies </span>You'll Enjoy Without the hassle</h1>
          <Search searchterm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[20px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ): errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):<ul>
              {movies.map((movie) => (
                // <p key={movie.id} className='text-white'>{movie.title}</p>
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>}
        </section>
        {/* <h1 className='text-white'>{searchTerm}</h1> */}
      </div>
    </main>
  )
}

export default App
