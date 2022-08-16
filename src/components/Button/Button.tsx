import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Variant = 'neutral' | 'punch-through';

type Props<C extends React.ElementType> = {
  children: ReactNode;
  variant: Variant;
  large?: boolean;
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

function Button<C extends React.ElementType>({
  children,
  as,
  variant,
  large,
  ...rest
}: Props<C>) {
  const Component = as || 'button';
  return <Component {...rest}>{children}</Component>;
}

export default styled(Button)`
  border-radius: 100px;
  border: none;
  background-color: ${(props) => props.theme.colors[props.variant + 'Bg']};
  color: ${(props) =>
    props.variant == 'neutral'
      ? props.theme.fontColors.bodyLight
      : props.theme.fontColors.default} !important;
  padding: 5px 20px;
  font-family: ${(props) => props.theme.fonts.body};
  cursor: pointer;
  ${(props) =>
    props.large
      ? `
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 50px;
      padding-right: 50px;
    `
      : ''}

  transition-duration: 0.2s;

  :hover {
    background-color: ${(props) =>
      props.theme.colors[props.variant + 'BgAccent']};
    transition-duration: 0.2s;
  }
`;
