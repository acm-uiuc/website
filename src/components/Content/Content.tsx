import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props<C extends React.ElementType> = {
  children: ReactNode;
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

function Content<C extends React.ElementType>({
  as,
  children,
  background,
}: Props<C>) {
  const Component = as || 'main';
  return (
    <div style={{ backgroundColor: background, width: '100%' }}>
      <Component>{children}</Component>
    </div>
  );
}

export default styled(Content)`
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.xl}px) {
    width: ${(props) => 0.95 * props.theme.breakpoints.xl}px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}px) {
    width: ${(props) => 0.95 * props.theme.breakpoints.lg}px;
  }

  margin-left: auto;
  margin-right: auto;

  padding-bottom: ${(props) => props.theme.transitions.height}px;
`;
