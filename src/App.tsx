import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersList from "@/pages/admin/UsersList";
import UserForm from "@/pages/admin/UserForm";

// Responsable Pages
import ResponsableDashboard from "@/pages/responsable/ResponsableDashboard";
import BooksList from "@/pages/responsable/BooksList";
import BookForm from "@/pages/responsable/BookForm";
import CategoriesList from "@/pages/responsable/CategoriesList";
import EmpruntsList from "@/pages/responsable/EmpruntsList";

// Client Pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientBooks from "@/pages/client/ClientBooks";
import ClientEmprunts from "@/pages/client/ClientEmprunts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UserForm />
                </ProtectedRoute>
              }
            />

            {/* Responsable Routes */}
            <Route
              path="/responsable"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <ResponsableDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/responsable/books"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <BooksList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/responsable/books/create"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <BookForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/responsable/books/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <BookForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/responsable/categories"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <CategoriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/responsable/emprunts"
              element={
                <ProtectedRoute allowedRoles={["RESPONSABLE"]}>
                  <EmpruntsList />
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/books"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <ClientBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/emprunts"
              element={
                <ProtectedRoute allowedRoles={["CLIENT"]}>
                  <ClientEmprunts />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
