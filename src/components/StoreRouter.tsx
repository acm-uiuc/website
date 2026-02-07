import { Route, Router, Switch, useRoute } from 'wouter-preact';

import StoreItem from './StoreItem';

const StoreDetail = () => {
  const [match, params] = useRoute('/:id');

  if (!match) {
    return <div>Store not found</div>;
  }

  return <StoreItem id={params.id} />;
};

const StoreIndex = () => {
  return (
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-3xl font-bold mb-4">ACM @ UIUC Store</h1>
      <p>Browse all products...</p>
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
