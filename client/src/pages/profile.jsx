import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/profile';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Profile | Cat Collector </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
