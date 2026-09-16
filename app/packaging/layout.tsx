import type { Metadata } from 'next';
import './packaging.css';

export const metadata: Metadata = {
  title: 'Advanced Packaging — A Founder Operating Manual',
  description:
    'A dense, interactive primer on the semiconductor packaging industry for commercially strong founders without an engineering background. Value chain, technology ladder, CoWoS, HBM, economics, yield maths, bottlenecks and where a startup can realistically enter.',
};

export default function PackagingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
