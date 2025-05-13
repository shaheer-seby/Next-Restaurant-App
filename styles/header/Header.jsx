'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '@/components/layout/layout';

const Header = () => {

  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef();
  const [customer, setCustomer] = useState(null);
  const customerId = Cookies.get('customer');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (customerId) {
      axios
        .get(`/api/admin/customers/${customerId}`)
        .then(({ data }) => setCustomer(data))
        .catch(console.error);
    }
  }, [customerId]);

  const logout = () => {
    Cookies.remove('customer');
    Cookies.remove('customerName');
    router.push('/');
  };

  const linkColor = scrolled ? 'text-dark' : 'text-white';
  const iconFilter = scrolled ? 'invert(0)' : 'invert(1)';

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
      style={{ transition: 'background-color 0.3s' }}
    >
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img src="/logo.png" height="40" alt="Logo" />
        </Link>
        <button
          className="navbar-toggler bg-white"
          type="button"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(prev => !prev)}
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: iconFilter }}
          />
        </button>

        <div
          className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            {['/category', '/food', '/order', '/reservations', '/blogs', '/contact'].map(
              (path, idx) => {
                const labels = ['Categories', 'Food', 'Order', 'Book', 'Blogs', 'Contact'];
                return (
                  <li className="nav-item" key={idx}>
                    <Link className={`nav-link ${linkColor}`} href={path}>
                      {labels[idx]}
                    </Link>
                  </li>
                );
              }
            )
}
          </ul>
<Layout></Layout>




          <ul className="navbar-nav align-items-center">
            <li className="nav-item position-relative" ref={profileRef}>
              <button className="btn" onClick={() => setOpenProfile(p => !p)}>
                {customer?.thumb ? (
                  <img
                    src={`/customers/${customer.thumb}`}
                    height="30"
                    className="rounded-circle"
                    alt="avatar"
                  />
                ) : (
                  <i
                    className="fa fa-user-circle fa-2x"
                    style={{ filter: iconFilter }}
                  ></i>
                )}
              </button>
              {openProfile && (
                <ul
                  className="list-unstyled card p-2 position-absolute"
                  style={{ top: '100%', right: 0, zIndex: 1000 }}
                >
                  {customer ? (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/customer/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={logout}>
                          Logout
                        </button>
                      </li>
                      
                    </>
                  ) : (
                    <li>
                      <Link className="dropdown-item" href="/login">
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
