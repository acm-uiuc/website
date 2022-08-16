import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props<C extends React.ElementType> = {
  children: ReactNode;
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

function Text<C extends React.ElementType>({
  children,
  as,
  ...rest
}: Props<C>) {
  const Component = as || 'p';
  return <Component {...rest}>{children}</Component>;
}

export default styled(Text)`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body}px;
`;
