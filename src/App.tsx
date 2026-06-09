import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PrinciplesPage from "./pages/PrinciplesPage";
import QuizPage from "./pages/QuizPage";
import CertificatePage from "./pages/CertificatePage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/principles" element={<PrinciplesPage />} />
        <Route path="/quiz/:courseId" element={<QuizPage />} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
