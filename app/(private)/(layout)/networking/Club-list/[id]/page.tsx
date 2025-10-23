'use client';

import ClubCard from '@/components/networking/ClubsCard';
import { clubs } from '@/dummydata/networking';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function Page() {
  const { id } = useParams(); // e.g. 'sedans', 'offroad', etc.

  // Filter clubs by categoryType
  const filteredClubs = clubs.filter(
    (club) => club.categoryType.toLowerCase() === String(id).toLowerCase()
  );

  return (
    <>
      {/* Sticky Header */}
      <header className="w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md shadow-sm border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/networking">Networking</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/networking/${id}`}>{id}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl sm:text-3xl font-bold text-primary capitalize mt-4 sm:mt-0">
            {id} Clubs
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <section className="min-h-screen bg-background text-text py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredClubs.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              <p className="text-lg">No clubs found for “{id}”.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
