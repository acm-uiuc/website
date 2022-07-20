import { Button } from './Button';
import './header.css';

type User = {
  name: string;
};

/*
add users and auth later

interface ButtonGroup {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}
user, onLogin, onLogout, onCreateAccount
*/
interface ButtonGroup {
    user?: User;
}

export const ButtonGroup = ({ user }: ButtonGroup) => (
  <header>
    <div className="wrapper">
      <div>
        {user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            {/*<Button size="small" onClick={onLogout} label="Log out" />*/}
          </>
        ) : 
        (
          <>
            <Button size='large' primary={true} label="Member Login" />
            <a href='https://discord.com' target="_blank" rel="noopener">
                <Button size="small" label="icon" />
            </a>
            <a href='https://slack.com' target="_blank" rel="noopener">
                <Button size="small" label="icon" />
            </a>
            
          </>
        )}
      </div>
    </div>
  </header>
);
