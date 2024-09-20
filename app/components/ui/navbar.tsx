import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-semibold">
            <Link to="/">Athens</Link>
          </h1>
          <div className="flex space-x-4 text-sm">
            <Link to="/new">New</Link>
            <Link to="/threads">Threads</Link>
            <Link to="/comments">Comments</Link>
            <Link to="/ask">Ask</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
