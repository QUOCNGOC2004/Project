import React, { useState, useEffect } from "react";
import "./tt.css"; 


const getAuthData = () => {
  const token = localStorage.getItem("user_token"); 
  const userString = localStorage.getItem("user_info");
  let userId = null;
  if (userString) {
    try {
      userId = JSON.parse(userString).id; 
    } catch (e) {
      console.error("Không thể parse user_info:", e);
    }
  }
  return { userId, token };
};


const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};


interface Notification {
  id: number;
  user_id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string; 
}

const Tt: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      const { token } = getAuthData();

      if (!token) {
        setError("Không thể xác thực người dùng.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/appointments/user/my-notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi tải thông báo");
        }

        const data: Notification[] = await response.json();
        setNotifications(data); 

        fetch(`${apiUrl}/appointments/user/my-notifications/mark-as-read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [apiUrl]);


  const renderContent = () => {
    if (isLoading) {
      return <p className="notification-placeholder">Đang tải thông báo...</p>;
    }

    if (error) {
      return <p className="notification-placeholder">{error}</p>;
    }

    if (notifications.length === 0) {
      return <p className="notification-placeholder">Bạn chưa có thông báo nào.</p>;
    }

    return (
      <ul className="notification-list">
   
        {notifications.map((item) => (
          <li 
            key={item.id} 
           
            className={`notification-item type-${item.type} ${!item.is_read ? 'unread' : ''}`}
          >
            <div className="notification-icon">
              {item.type === 'appointment_confirmed' && '✓'}
              {item.type === 'appointment_cancelled' && '⚠'}
              {item.type === 'appointment_deleted' && '✖'}
              {item.type === 'invoice_created' && '$'}
              {item.type === 'invoice_updated' && '$'}
              {item.type === 'appointment_completed' && 'ℹ'}
            </div>
            <div className="notification-info">
        
              <span className="notification-message" dangerouslySetInnerHTML={{ __html: item.message }} />
         
              <span className="notification-date">{formatDate(item.created_at)}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="profile-side-column">
      <div className="profile-card">
        <div className="profile-body">
          <div className="profile-section">
            <h4>Thông báo</h4>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tt;