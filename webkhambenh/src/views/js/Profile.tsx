import React from "react";
import Users from '../../components/js/forProfile/Users';
import TT from '../../components/js/forProfile/Tt';
import '../../views/css/profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page-layout">
      <Users />
      <TT />
    </div>
  );
};

export default Profile;