import styled from 'styled-components';
import Header from '../Header/Header';
import Text from '../Text/Text';

export const Container = styled.article`
  background-color: #fafafa;
  border: 2px solid rgba(62, 72, 111, 0.1);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 260px;
  transition: all 0.4s ease;

  filter: grayscale(35%);
  
  &:hover {
    border: 2px solid white;
    filter: grayscale(0%) drop-shadow(0 4px 12px rgb(104 112 118 / 0.08)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.04));
    transform: translateY(-1px);
    background-color: white;
  }
`;

export const Image = styled.img`
  height: 50px;
  object-fit: contain;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-top: 10px;
`;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  justify-content: space-between;
  height: 100%;
`;

export const MiddleText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  align-items: center;
`;

export const Title = styled((props) => <Header level={2} {...props} />)`
  font-weight: 600;
  line-height: 22px;
  margin: 0px;
  padding-bottom: 10px;
`;

export const Description = styled(Text)`
  line-height: 24px;
  margin: 0px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const LowerLayout = styled.div`
  display: inline-block;
  width: 100%;
`;

export const Link = styled.span`
  border-radius: 12px;
  line-height: 20px;
  font-size: 14px;
  float: left;
`;

export const Href = styled((props) => <Text as="a" {...props} />)`
  display: inline-flex;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  line-height: 1.75;
  padding: 4px 5px;
  border-radius: 4px;
  color: #1976d2;
  transition: all 0.4s ease;
  &:hover {
    background-color: #eceaea;
  }
`;

export const LinkPlaceholder = styled.div`
  display: flex;
  flex-direction: row;
  float: right;
`;
