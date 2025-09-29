import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom'; // 1. Import useHistory
import Users from '../../components/js/forProfile/Users';
import TT from '../../components/js/forProfile/Tt';
import '../../views/css/profile.css';
import { isLoggedIn } from '../../ktraLogin';

const Profile: React.FC = () => {
  const history = useHistory(); 

  useEffect(() => {
    if (!isLoggedIn()) {
      history.push('/');
      return;
    }
    
    const handleLoginStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!customEvent.detail.isLoggedIn) {
        history.push('/'); 
      }
    };

    document.addEventListener('loginStatusChanged', handleLoginStatusChange);

    
    return () => {
      document.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };

  }, [history]); 


  if (!isLoggedIn()) {
      return null; 
  }

  return (
    <div className="profile-page-layout">
      <Users />
      <TT />
    </div>
  );
};

export default Profile;