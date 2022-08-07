import styled from "styled-components";

export const Container = styled.article`
    background: #ffffff;
    box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 260px;
    width: 312px;
    &:hover {
        transform: translateY(-2px);
    }
    transition: all 0.4s ease;
`

export const Image = styled.img`
    //height: 150px;
    height: 50px;
    object-fit: contain;
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`

export const Layout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    justify-content: space-between;
    height: 100%;
`

export const MiddleText = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: center;
`

export const Title = styled.h2`
    font-family: Inter;
    font-weight: 600;
    line-height: 22px;
    margin: 0px;
    padding-bottom: 10px;
    font-family: sans-serif;
`

export const Description = styled.p`
    font-size: 14px;
    line-height: 24px;
    margin: 0px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`

export const LowerLayout = styled.div`
    display: inline-block;
    width: 100%;
`

export const Link = styled.span`
    border-radius: 12px;
    line-height: 20px;
    font-size: 14px;
    float: left;
`

export const Href = styled.a`
    display: inline-flex;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 1000;
    font-size: 1rem;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    padding: 4px 5px;
    border-radius: 4px;
    color: #1976d2;
    text-transform: uppercase;
    //border: 1px solid #1976d2;
    transition: all 0.4s ease;
    &:hover {
        transform: translateY(-2px);
        //background-color: rgba(25, 118, 210, 0.04);
        background-color: #eceaea;
        //border: 1px solid #1976d2;
    }
`

export const LinkPlaceholder = styled.div`
    display: flex;
    flex-direction: row;
    float: right;
`