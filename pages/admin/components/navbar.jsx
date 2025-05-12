import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo or Title */}
        <Link href="/" className="navbar-brand">
          Admin Panel
        </Link>
        
        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/admin/dashboard" className="nav-link active">
                Dashboard
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link href="/admin/deliveryboy" className="nav-link">
                Delivery Boy
              </Link>
            </li> */}
            <li className="nav-item">
              <Link href="/admin/categories" className="nav-link">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/foods" className="nav-link">
                Foods
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/orders" className="nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/reservations" className="nav-link">
                Reservations
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/blogs" className="nav-link">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/settings" className="nav-link">
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
