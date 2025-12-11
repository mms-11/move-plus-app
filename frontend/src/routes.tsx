import { BrowserRouter, Routes as RoutesDOM, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import SearchClasses from "./pages/SearchClasses";
import CreateClass from "./pages/CreateClass";
import Auth from "./pages/Auth";
import ProfessionalRegistration from "./pages/ProfessionalRegistration";
import StudentRegistration from "./pages/StudentRegistration";
import Dashboard from "./pages/Dashboard";
import ClassManagement from "./pages/ClassManagement";
import ClassDetails from "./pages/ClassDetails";
import MyClasses from "./pages/MyClasses";
import Financial from "./pages/Financial";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/protectedRoute";
import Profile from "./pages/Profile";
import PrivateChat from "./pages/PrivateChat";
import LoginPhone from "./pages/LoginPhone";
import Onboarding from "./pages/Onboarding";
import AuthGuard from "@/components/AuthGuard"; 

export function Routes() {
  return (
    <AuthGuard>
      <RoutesDOM>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<LoginPhone />} />

        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* ESTUDANTES */}
        <Route
          path="/minhas-turmas"
          element={
            <ProtectedRoute requireRole="student">
              <MyClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turma-aluno/:id"
          element={
            <ProtectedRoute requireRole="student">
              <ClassDetails />
            </ProtectedRoute>
          }
        />

        {/* PROFISSIONAIS */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireRole="professional">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* ... outras rotas de professional ... */}

        {/* COMUNS (Perfil, Chat) */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </RoutesDOM>
    </AuthGuard>
  );
}
