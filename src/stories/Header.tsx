import { Button } from './Button';
import './header.css';
import { linkTo } from '@storybook/addon-links';

/*
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
interface HeaderProps {

}

export const Header = ({  }: HeaderProps) => (
  <header>
    <div className="wrapper">
      <div>
        <h1>Logo here</h1>
      </div>
      <div>
        
          <>
            <Button size="small" label="About" onClick={linkTo('Button', 'second')}></Button>
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
