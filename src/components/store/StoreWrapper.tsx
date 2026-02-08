import { useEffect, useState } from 'preact/hooks';
import StoreItem from './StoreItem';
import type { ApiV1StoreProductsGet200ResponseProductsInner } from '@acm-uiuc/core-client';
import ReactNavbar from '../generic/ReactNavbar';
import StoreProducts from './StoreProducts';

type Product = ApiV1StoreProductsGet200ResponseProductsInner;

interface Props {
  currentPath: string;
}

const StoreWrapper = ({ currentPath }: Props) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id'));
  }, []);

  if (id) {
    return <StoreItem id={id} currentPath={`${currentPath}?id=${id}`} />;
  } else {
    return <StoreProducts currentPath={currentPath} />;
  }
};

export default StoreWrapper;
