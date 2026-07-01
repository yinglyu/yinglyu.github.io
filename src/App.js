import React, { useState } from "react";
import { Resume } from './components/Resume';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { Calendar } from './components/Calendar';
import { NavBar } from './components/NavBar';

const pages = {
  home: Home,
  resume: Resume,
  game: Game,
  calendar: Calendar,
};

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const ActivePage = pages[activePage];

  return (
    <React.Fragment>
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      <ActivePage />
    </React.Fragment>
  );
};




export default App;
