
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/Layout/DashboardLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DepartmentDashboard from "./pages/Dashboard/DepartmentDashboard";
import CitizenDashboard from "./pages/Dashboard/CitizenDashboard";
import ReportIssue from "./pages/Dashboard/Citizen/ReportIssue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="department" element={<DepartmentDashboard />} />
            <Route path="citizen" element={<CitizenDashboard />} />
            <Route path="citizen/report" element={<ReportIssue />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
