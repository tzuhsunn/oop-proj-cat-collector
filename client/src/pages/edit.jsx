import { Helmet } from 'react-helmet-async';

import { EditView } from 'src/sections/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <>
      <Helmet>
        <title> 編輯圖片 | Cat Collector </title>
      </Helmet>

      <EditView />
    </>
  );
}
