import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { routesConfig } from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
