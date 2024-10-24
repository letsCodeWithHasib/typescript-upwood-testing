import { Route, Routes } from "react-router-dom";

//routes
import AuthRouteWrapper from "./routes/AuthRouteWrapper";

//pages
import { LoginPage } from "./pages/protected";

// layouts
import { ProtectedLayout } from "./layout";

function App() {
  return (
    <Routes>
      {/* for protected Route */}
      <Route
        path="/auth"
        element={
          <AuthRouteWrapper>
            <ProtectedLayout />
          </AuthRouteWrapper>
        }
      >
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
