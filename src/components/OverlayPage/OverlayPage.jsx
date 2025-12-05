import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OverlayPage({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  return children;
}
