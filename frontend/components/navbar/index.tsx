import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/apis/auth';
import type { MenuProps } from 'antd';
import { message, Button, Menu, Dropdown } from 'antd';

interface User {
  full_name: string;
  role: string;
  user_id: number;
}

const items: MenuProps['items'] = [
  {
    key: 'logout',
    label: 'Đăng xuất'
  },
]

function NavbarSimple() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.cookie();
        setUser(response.data);
      } catch (error) {
        // console.error('Failed to fetch user:', error); 
        router.push('/login')
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

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'logout')
      handleLogout()
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
                  <Dropdown
                    menu={{ items, onClick }}
                  >
                    <p className='hover:cursor-pointer'>
                      Xin chào, <i className='text-lg'>{user.full_name}</i>
                    </p>
                  </Dropdown>
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
                  <Dropdown
                    menu={{ items, onClick }}
                  >
                    <p className='hover:cursor-pointer'>
                      Xin chào, <i className='text-lg'>{user.full_name}</i>
                    </p>
                  </Dropdown>
                </div>
              </>
            )
          ) : (
            <div className="navbar-end">
              <a href='/login' className="btn border-none bg-green-500 text-white hover:bg-green-400">Đăng Nhập</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavbarSimple;
