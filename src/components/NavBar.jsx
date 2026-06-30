import React from "react";
import Styled from '@emotion/styled';
import { Link, useLocation } from "react-router-dom";

const NavBarWrapper = Styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
`;

const LinkItem = Styled.li`
  display: inline;
  list-style-type: none;
  margin: 0;
  & > a {
    color: #FFF;
    font-weight: bold;
    text-decoration: none;
    padding: 0.75rem 1rem;
    display: inline-block;
    border-radius: 999px;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  & > a:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }
`;

const LinkList = Styled.ul`
  padding: 0;
  font-size: 1.5em;
  margin: 0;
  font-weight: 100;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const ActiveLinkItem = Styled(LinkItem)`
  & > a {
    background: rgba(255,255,255,0.28);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
  }
`;

export const NavBar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isResume = location.pathname === '/resume';

  return (
    <NavBarWrapper>
      <LinkList>
        {isHome ? (
          <ActiveLinkItem>
            <Link to="/">Home</Link>
          </ActiveLinkItem>
        ) : (
          <LinkItem>
            <Link to="/">Home</Link>
          </LinkItem>
        )}
        {isResume ? (
          <ActiveLinkItem>
            <Link to="/resume">Resume</Link>
          </ActiveLinkItem>
        ) : (
          <LinkItem>
            <Link to="/resume">Resume</Link>
          </LinkItem>
        )}
      </LinkList>
    </NavBarWrapper>
  );
};