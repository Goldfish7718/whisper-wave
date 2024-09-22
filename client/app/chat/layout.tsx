import ProtectedRoute from "@/components/ProtectedRoute";
import ChatLayoutProps from "@/types/types";

const layout = ({ children }: ChatLayoutProps) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default layout;
