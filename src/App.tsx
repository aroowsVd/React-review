import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Tv from "./pages/Tv"
import Search from "./pages/Search"
import Header from "./components/Header"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:movieId" element={<Home />} />
        </Route>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  )
}

export default App
