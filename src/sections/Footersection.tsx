import Footer from "../stories/Footer"
import styled from "styled-components"

const Container = styled.div`
    width: 100%;
    height: 200px;
    background-color: #333;
    color: white;
    position: relative;
    margin-top: 40px;
`

const Footersection = () => {
    return (
        <Container>
            <Footer />
        </Container>
    )
}

export default Footersection