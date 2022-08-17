import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Text from '../Text/Text';

type Props<C extends React.ElementType> = {
  children: ReactNode;
  as?: C;
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<C>;

function Header<C extends React.ElementType>({
  as,
  children,
  level,
  ...rest
}: Props<C>) {
  return (
    <Text
      as={('h' + level) as React.ElementType}
      children={children}
      {...rest}
    />
  );
}

export default styled(Header)`
  font-size: ${(props) =>
    props.theme.fontSizes['h' + props.level]}px !important;
  font-weight: 600 !important;
  color: ${(props) =>
    props.level <= 2
      ? props.theme.colors.acmDark
      : props.theme.fontColors.default};
`;
