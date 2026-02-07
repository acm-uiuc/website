import {
  type ApiV1StoreProductsProductIdGet200Response,
  ResponseError,
} from '@acm-uiuc/core-client';
import { useEffect, useState } from 'react';

import { storeApiClient } from '../api';
import { handleResponseError } from '../util';
import ErrorPopup, { useErrorPopup } from './ErrorPopup';

type Product = ApiV1StoreProductsProductIdGet200Response;

const StoreItem = ({ id }: { id: string }) => {
  const [productInfo, setProductInfo] = useState<Product>();
  const { error, showError, clearError } = useErrorPopup();

  useEffect(() => {
    (async () => {
      try {
        const productData = await storeApiClient.apiV1StoreProductsProductIdGet(
          { productId: id }
        );
        setProductInfo(productData);
      } catch (e) {
        await handleResponseError(
          e,
          showError,
          404,
          'Failed to retrieve product.'
        );
      }
    })();
  }, [id]);
  const baseReturn = (
    <ErrorPopup
      error={error}
      onClose={() => {
        clearError();
        window.location.href = '/store';
      }}
    />
  );
  if (!productInfo) {
    return baseReturn;
  }
  return (
    <>
      {baseReturn}
      <div class="relative z-10 w-full max-w-5xl">
        <div class="rounded-2xl border border-gray-200 bg-white p-16 shadow-xl lg:p-10">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-navy-900 lg:text-3xl text-center">
              {productInfo.name}
            </h1>
            <p
              className="mt-2 text-gray-800 font-medium whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: productInfo.description ?? '',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreItem;
