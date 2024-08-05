import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/apis/auth';
import { message } from 'antd';

interface User {
  full_name: string;
  role: string;
  user_id: number;
}

function NavbarSimple() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.cookie();
        setUser(response.data);
        message.info(`User ID: ${response.data.user_id}`);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setShowLogout(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleLogoutMenu = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div className="sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <a className="normal-case" href="/">
              <img
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                className="w-52 ml-3 md:ml-0"
              />
            </a>
          </div>

          {user ? (
            user.role === 'admin' || user.role === 'business' ? (
              <div className="navbar-end">
                <span className="btn" onClick={handleLogout}>
                  Đăng Xuất
                </span>
              </div>
            ) : (
              <>
                <div className="navbar-center hidden lg:flex">
                  <ul className="menu menu-horizontal p-0">
                    <li>
                      <a href="/">Trang chủ</a>
                    </li>
                    <li>
                      <a href="/about">Giới thiệu</a>
                    </li>
                    <li>
                      <a href="/contact">Liên hệ</a>
                    </li>
                  </ul>
                </div>

                <div className="navbar-end">
                  <span className="btn" onClick={toggleLogoutMenu}>
                    Xin chào, {user.full_name}
                  </span>
                  {showLogout && (
                    <a href="#" onClick={handleLogout} className="btn">
                      Đăng Xuất
                    </a>
                  )}
                </div>
              </>
            )
          ) : (
            <div className="navbar-end">
              <a href='/login' className="btn">Đăng Nhập</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavbarSimple;
