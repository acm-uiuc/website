import { Button } from './Button';
import './header.css';
import image from '../images/logo.png';
import { Link } from 'react-router-dom';

/*
original header props:
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

export const Header = ({ }: HeaderProps) => (
  <header>
    <div className="wrapper">
      <div>
        <Link to='/'><img src={image} className='logo' alt="ACM logo" /></Link>
      </div>
       <div className='buttons'> 
          <>
            <Link to='/about'><Button size="small" label="About" /></Link>
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