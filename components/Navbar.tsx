import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="w-full px-6 py-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p className="font-bold">DevEvent</p>
        </Link>

        <ul className="flex items-center gap-6 list-none">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">Events</Link>
          </li>
          <li>
            <Link href="/">Create Event</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
