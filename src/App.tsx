import { LandingPage } from "@pages/lending/lending-page";
import { MainPage } from "@pages/main-app/main-page";
import { ThemeProvider } from "@theme/theme-provider/theme-provider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/application/:conversationId" element={<MainPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
