import { useEffect, useState } from 'preact/hooks';
import StoreItem from './StoreItem';

const StoreWrapper = () => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id'));
  }, []);

  if (id) {
    return <StoreItem id={id} />;
  } else {
    return (
      <div class="container mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-4">ACM @ UIUC Store</h1>
        <p>Browse all products...</p>
      </div>
    );
  }
};

export default StoreWrapper;
