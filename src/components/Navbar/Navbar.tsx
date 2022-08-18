import styled from 'styled-components';
import Text from '../Text/Text';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

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
    margin-left: -15px;
  }

  /* Nav menu */
  .nav {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: var(--black);
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

  width: 90%;

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
  return (
    <NavContainer {...rest}>
      <NavHeader>
        <SiteTitle as={Link} to="/" className="logo">
          <img src={require('./logo.png')} alt="logo" />
        </SiteTitle>

        <input className="side-menu" type="checkbox" id="side-menu" />
        <label className="hamb" htmlFor="side-menu">
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
              <NavLink as={HashLink} to="/#sighighlight" className="navLink">
                SIGs
              </NavLink>
            </li>
            <li>
              <NavLink as={HashLink} to="/about/#reflections" className="navLink">
                  Reflections | Projections
                </NavLink>
            </li>
            <li>
              <NavLink as="a" href="/about/#hackillinois" className="navLink">
                HackIllinois
              </NavLink>
            </li>
            <li>
              <NavLink as={HashLink} to="/#sponsors" className="navLink">
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
