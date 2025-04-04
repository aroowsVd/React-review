import { useQuery } from "@tanstack/react-query";
import { getMovies } from "./api";
import { IGetMovieResult } from "../types/apiInterface";
import styled from "styled-components";
import { makeImagePath } from "./util";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.main`
  background: black;
  padding-bottom: 200px;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface MyComponentProps extends React.HTMLProps<HTMLElement> {
  $bgPhoto?: string;
}

const Banner = styled.section<MyComponentProps>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
  url(${props => props.$bgPhoto});
  background-size: cover;
  box-sizing: border-box;
`

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`

const OverView = styled.p`
  font-size: 36px;
  width: 50%;
`

const Slider = styled.div`
  position: relative;
  top: -100px;
`

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`

const Box = styled(motion.div)<MyComponentProps>`
  background-color: white;
  background-image: url(${props => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`

const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.9);
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
`

const BigMovie = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  height: 80vh;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  overflow: hidden;
`

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`

const BigTitle = styled.h2`
  font-size: 46px;
  position: relative;
  top: -60px;
  padding: 20px;
`

const BigOverview = styled.p`
  position: relative;
  top: -60px;
  padding: 20px;
`

const rowVariants = {
  hidden: {
    x: window.innerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth -10
  }
}

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween"
    }
  }
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween"
    }
  }
}

const offset:number = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies
  })
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [index, setIndex] = useState<number>(0);
  const [leaving, setLeaving] = useState<boolean>(false);
  
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      const totalMovie = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovie / offset) - 1;
      toggleLeaving();
      setIndex(prev => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const toggleLeaving = () => setLeaving(prev => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  }

  const onOverlayCLick = () => {
    navigate(-1)
  }

  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id === Number(bigMovieMatch.params.movieId))

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
        ) : (
        <>
          <Banner onClick={increaseIndex} $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index}
              >
                {data?.results.slice(1).slice(offset * index, offset * index + offset).map(movie => (
                  <Box 
                    layoutId={String(movie.id)}
                    key={movie.id}
                    onClick={() => onBoxClicked(movie.id)}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{type: "tween"}}
                    $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info 
                      variants={infoVariants}
                    >
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch && 
              <>
                <Overlay onClick={onOverlayCLick} exit={{opacity: 0}} animate={{opacity: 1}} />
                <BigMovie 
                  layoutId={bigMovieMatch.params.movieId}
                  style={{top: scrollY + 100}}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} 
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            }
          </AnimatePresence>
        </>
        )}
    </Wrapper>
  );
}

export default Home