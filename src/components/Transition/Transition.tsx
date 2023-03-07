import styled from 'styled-components';

type Props = {
  to: string;
};

const TransitionElem = styled.div`
  height: ${(props) => props.theme.transitions.height}px;
  margin-top: -${(props) => props.theme.transitions.height}px;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

function Transition({ to }: Props) {
  return <TransitionElem style={{ backgroundColor: to }} />;
}

export default Transition;
