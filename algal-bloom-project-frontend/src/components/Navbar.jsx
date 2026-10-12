import { Waves, Menu } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-brand">
        <div className="logo">
          <Waves size={25} />
        </div>

        <div>
          <h1>AlgalGuard AI</h1>
          <span>Environmental Monitoring</span>
        </div>
      </div>

      <button className="mobile-menu">
        <Menu size={24} />
      </button>

    </header>
  );
}

export default Navbar;