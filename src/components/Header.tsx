import { Button } from './Button';
import './header.css';
import image from '../images/logo.png';
import styled from 'styled-components';

/*
original header props here
type User = {
  name: string;
};

interface HeaderProps {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}
user, onLogin, onLogout, onCreateAccount
*/
interface HeaderProps {}

/*
styled components
const ImageLink = styled(Link)`
  img {
    width: 253px;
height: 107px;

flex: none;
order: 0;
flex-grow: 0;
  }
`;

const StyledLink = styled(Link)`
width: 56px;
height: 25px;

font-family: 'Avenir';
font-style: normal;
font-weight: 800;
font-size: 18px;
line-height: 25px;


color: #FFFFFF;

flex: none;
order: 1;
flex-grow: 0;`;*/

export const Header = ({ }: HeaderProps) => (
  <header>
    <div className="wrapper">
      <div>
        {<img src={image} className='logo' alt="ACM logo" />}
      </div>  
       <div className='buttons'> 
          <>
            <Button size="small" label="About" />
            <Button size="small" label="SIGs" />
            <Button size="small" label="Reflections | Projections" />
            <Button size="small" label="HackIllinois" />
            <Button size="small" label="HackThis" />
            <Button size="small" label="Sponsers" />
          </>
        
      </div>
    </div>
  </header>
);