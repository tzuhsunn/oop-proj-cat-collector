import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/profile';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Profile | ScritchCare </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
