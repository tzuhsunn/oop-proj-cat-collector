import { Helmet } from 'react-helmet-async';

import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> 貓貓圖鑑 | Cat Collector </title>
      </Helmet>

      <ProductsView />
    </>
  );
}
