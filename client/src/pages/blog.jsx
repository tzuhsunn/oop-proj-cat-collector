import { Helmet } from 'react-helmet-async';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> 貓貓抽卡 | Cat Collector </title>
      </Helmet>

      <BlogView />
    </>
  );
}
