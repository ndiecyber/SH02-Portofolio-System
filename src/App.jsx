import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Loader from './components/common/Loader';
import { routesConfig } from './routes/routes';

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="lg" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          {routesConfig.map((route, idx) => {
            if (route.isProtected) {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  {route.children.map((child, cIdx) => (
                    <Route
                      key={cIdx}
                      index={child.index}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              );
            }
            return (
              <Route
                key={idx}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
