import React from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `https://zawrindustries.com${crumb.item}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
