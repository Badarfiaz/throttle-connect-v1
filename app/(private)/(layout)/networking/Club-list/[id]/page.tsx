'use client'

import ClubCard from '@/components/networking/ClubsCard';
import { clubs } from '@/dummydata/networking';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams(); // e.g. 'sedans', 'offroad', etc.

  // Filter clubs by categoryType
  const filteredClubs = clubs.filter(
    (club) => club.categoryType.toLowerCase() === String(id).toLowerCase()
  );

  return (
    <section className="min-h-screen bg-background text-text py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {id} Clubs
        </h1>

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
  );
}
