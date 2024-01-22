import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const ImagePage = lazy(() => import('src/pages/image-edit'));
export const ChatPage = lazy(() => import('src/pages/chat'));
export const EditPage = lazy(() => import('src/pages/edit'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'all-cats', element: <ProductsPage /> },
        { path: 'recommend', element: <BlogPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'image-edit', element: <ImagePage /> },
        { path: 'chat', element: <ChatPage /> },
        { path: 'edit', element: <EditPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
