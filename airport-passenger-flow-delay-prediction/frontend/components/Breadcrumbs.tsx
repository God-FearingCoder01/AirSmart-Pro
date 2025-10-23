import { useRouter } from 'next/router';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeMap: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/predictions': 'Predictions',
  '/reports': 'Reports',
};

export default function Breadcrumbs() {
  const router = useRouter();
  const pathSegments = router.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  if (router.pathname !== '/') {
    const currentLabel = routeMap[router.pathname] || 'Page';
    breadcrumbs.push({
      label: currentLabel,
      href: router.pathname,
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <span key={crumb.href} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {isLast ? (
              <span className="font-medium text-green-600">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-green-600 transition">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
