import { Route, Router, Switch, useRoute } from 'wouter-preact';

const StoreDetail = () => {
  const [match, params] = useRoute('/:id');

  if (!match) return <div>Store not found</div>;

  // Check if we're already on the query param version to prevent infinite redirect
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('id')) {
    // Already redirected, render the store detail
    return (
      <div class="container mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-4">Store: {urlParams.get('id')}</h1>
        <p>Store details here...</p>
      </div>
    );
  }

  // Redirect to query param format
  window.location.href = `/store?id=${params.id}`;
  return null;
};

const StoreIndex = () => {
  // Check if there's an id query param
  const urlParams = new URLSearchParams(window.location.search);
  const storeId = urlParams.get('id');

  if (storeId) {
    return (
      <div class="container mx-auto px-6 py-12">
        <h1 class="text-3xl font-bold mb-4">Store: {storeId}</h1>
        <p>Store details here...</p>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-3xl font-bold mb-4">All Stores</h1>
      <p>Browse all stores...</p>
    </div>
  );
};

const StoreRouter = () => {
  return (
    <Router base="/store">
      <Switch>
        <Route path="/" component={StoreIndex} />
        <Route path="/:id" component={StoreDetail} />
        <Route>404 - Store not found</Route>
      </Switch>
    </Router>
  );
};

export default StoreRouter;
