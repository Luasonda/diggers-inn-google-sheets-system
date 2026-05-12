import Link from 'next/link';

const links = [
  ['Dashboard', '/dashboard'],
  ['Products', '/products'],
  ['Sessions', '/sessions'],
  ['Issues', '/issues'],
  ['Users', '/users'],
  ['Reports', '/reports'],
];

export function AppNav() {
  return (
    <nav className="nav">
      {links.map(([label, href]) => (
        <Link key={href} href={href}>{label}</Link>
      ))}
    </nav>
  );
}
