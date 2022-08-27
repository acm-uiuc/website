import styled from 'styled-components';
import Text from '../Text/Text';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useRef } from 'react';

const NavHeader = styled.header`
  height: 105px;
  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
    padding-left: 0px;
  }

  /* Logo */
  .logo {
    display: inline-block;
    color: var(--white);
    font-size: 60px;
  }

  /* Nav menu */
  .nav {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
  }

  .menu a {
    display: block;
    margin-left: 30px;
    padding-right: 0px;
    padding-top: 25px;
    padding-bottom: 15px;
  }

  .nav {
    margin-top: -5px;
    max-height: 0;
    transition: all 0.2s ease-out;
  }

  /* Menu Icon */

  .hamb {
    cursor: pointer;
    float: right;
    padding: 50px 20px;
  }

  .hamb-line {
    background: ${(props) => props.theme.colors.white};
    display: block;
    height: 2px;
    position: relative;
    width: 22px;
  }

  .hamb-line::before,
  .hamb-line::after {
    background: ${(props) => props.theme.colors.white};
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all 0.2s ease-out;
    width: 100%;
  }

  .hamb-line::before {
    top: 7px;
  }

  .hamb-line::after {
    top: -7px;
  }

  .side-menu {
    display: none;
  }

  /* Toggle menu icon */

  .side-menu:checked ~ nav {
    height: 100% !important;
    max-height: 100% !important;
    background-color: ${(props) => props.theme.colors.acmDark};
  }

  .side-menu:checked ~ .hamb .hamb-line {
    background: transparent;
  }

  .side-menu:checked ~ .hamb .hamb-line::before {
    transform: rotate(-45deg);
    top: -1px;
    left: -1.5px;
  }

  .side-menu:checked ~ .hamb .hamb-line::after {
    transform: rotate(45deg);
    top: -1px;
    left: -1.5px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}px) {
    li a {
      margin-right: 40px;
    }
  }

  /* Responsiveness */

  @media (min-width: ${(props) => props.theme.breakpoints.md}px) {
    .nav {
      max-height: none;
      top: 0;
      position: relative;
      float: right;
      width: fit-content;
      margin-top: 0px;
    }

    .menu li {
      float: left;
    }

    .hamb {
      display: none;
    }
  }

  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.xl}px) {
    width: ${(props) => 0.95 * props.theme.breakpoints.xl}px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}px) {
    width: ${(props) => 0.95 * props.theme.breakpoints.lg}px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}px) px {
    width: ${(props) => 0.95 * props.theme.breakpoints.md}px;
  }

  margin-left: auto;
  margin-right: auto;
`;

const NavLink = styled(Text)`
  color: ${(props) => props.theme.colors.white};

  border-bottom: 3px solid rgba(0, 0, 0, 0);

  transition-duration: 0.2s;
  &:hover {
    border-bottom: 3px solid ${(props) => props.theme.colors.white};
    transition-duration: 0.2s;
  }
  font-weight: 500;
`;

const NavContainer = styled.div`
  background-color: ${(props) => props.theme.colors.acmDark};
`;

const SiteTitle = styled((props: any) => <Text {...props} />)`
  color: '#ffffff';
  height: 105px;
  overflow: hidden;
`;

function Navbar({ ...rest }: any) {
  const checkbox = useRef<HTMLInputElement | null>(null);
  const scrollLock = useRef<boolean>(false);

  const uncheck = () => {
    if (checkbox && checkbox.current != null) {
      checkbox.current.checked = false;
    }
    removeLockIfApplied();
  };

  const toggleLock = () => {
    if (scrollLock.current) {
      document.body.classList.remove('noscroll');
    } else {
      document.body.classList.add('noscroll');
    }
    scrollLock.current = !scrollLock.current;
  };

  const removeLockIfApplied = () => {
    if (scrollLock.current) {
      document.body.classList.remove('noscroll');
      scrollLock.current = false;
    }
  };

  return (
    <NavContainer {...rest}>
      <NavHeader>
        <SiteTitle as={Link} to="/" className="logo">
          <img src={require('./logo.png')} alt="logo" />
        </SiteTitle>

        <input
          className="side-menu"
          type="checkbox"
          id="side-menu"
          ref={checkbox}
        />
        <label className="hamb" htmlFor="side-menu" onClick={toggleLock}>
          <span className="hamb-line"></span>
        </label>

        <nav className="nav">
          <ul className="menu">
            <li>
              <NavLink as={Link} to="/about" className="navLink">
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                smooth
                as={HashLink}
                to="/#sighighlight"
                className="navLink"
                onClick={uncheck}
              >
                SIGs
              </NavLink>
            </li>
            <li>
              <NavLink
                smooth
                as={HashLink}
                to="/about/#reflections"
                className="navLink"
                onClick={uncheck}
              >
                Reflections | Projections
              </NavLink>
            </li>
            <li>
              <NavLink
                smooth
                as={HashLink}
                to="/about/#hackillinois"
                onClick={uncheck}
                className="navLink"
              >
                HackIllinois
              </NavLink>
            </li>
            <li>
              <NavLink
                smooth
                as={HashLink}
                to="/#sponsors"
                className="navLink"
                onClick={uncheck}
              >
                Sponsors
              </NavLink>
            </li>
          </ul>
        </nav>
      </NavHeader>
    </NavContainer>
  );
}

export default Navbar;
