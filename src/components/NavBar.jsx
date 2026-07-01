import React from "react";
import Styled from '@emotion/styled';

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
  & > button {
    color: #FFF;
    font-weight: bold;
    font: inherit;
    text-decoration: none;
    padding: 0.75rem 1rem;
    display: inline-block;
    border-radius: 999px;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  & > button:hover {
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

  @media (max-width: 36rem) {
    gap: 0;
    font-size: 1rem;
  }
`;

const ActiveLinkItem = Styled(LinkItem)`
  & > button {
    background: rgba(255,255,255,0.28);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
  }
`;

const tabs = [
  ['home', 'Home'],
  ['resume', 'Resume'],
  ['game', 'Game'],
  ['calendar', 'Calendar'],
];

export const NavBar = ({ activePage, onNavigate }) => {
  return (
    <NavBarWrapper>
      <LinkList>
        {tabs.map(([page, label]) => {
          const Item = activePage === page ? ActiveLinkItem : LinkItem;
          return (
            <Item key={page}>
              <button type="button" onClick={() => onNavigate(page)}>{label}</button>
            </Item>
          );
        })}
      </LinkList>
    </NavBarWrapper>
  );
};
