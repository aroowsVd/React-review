import { useQuery } from "@tanstack/react-query";
import { getMovies } from "./api";
import { IGetMovieResult } from "../types/apiInterface";
import styled from "styled-components";
import { makeImagePath } from "./util";

const Wrapper = styled.main`
  background: black;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.section<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
  url(${props => props.bgPhoto});
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

function Home() {
  const { data, isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies
  })

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
        ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
        </>
        )}
    </Wrapper>
  );
}

export default Home