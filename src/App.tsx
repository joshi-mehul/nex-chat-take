import { ThemeProvider } from "@theme/theme-provider/theme-provider";
import { LandingPage } from "@pages/lending/lending-page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatThreadPage } from "@pages/chat-thread/chat-thread";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatThreadPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
