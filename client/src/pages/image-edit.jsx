import { Helmet } from 'react-helmet-async';

import { ImageView } from 'src/sections/image';

// ----------------------------------------------------------------------

export default function ImageUploadPage() {
  return (
    <>
      <Helmet>
        <title> 上傳圖片 | Cat Collector </title>
      </Helmet>

      <ImageView />
    </>
  );
}
