import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ClientPage from './client-page';

export async function generateStaticParams() {
  try {
    const querySnapshot = await getDocs(collection(db, 'rocodromos'));
    
    if (querySnapshot.empty) {
      throw new Error('Fallback');
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    return [
      { id: "beclimb-malaga" },
      { id: "biwak" },
      { id: "campobase-burgos" },
      { id: "cereza-wall" },
      { id: "hangar-4" },
      { id: "natural-climb" },
      { id: "rocopolis" },
      { id: "sharma-bcn" },
      { id: "skala-burgos" },
      { id: "soul-climb" },
      { id: "sputnik-las-rozas" },
      { id: "arkose-madrid" },
      { id: "the-wall-alicante" },
      { id: "indoorwall-bilbao" },
      { id: "flashh-bcn" },
      { id: "geko-valladolid" },
      { id: "9a-murcia" },
      { id: "climbat-madrid" }
    ];
  }
}

export default async function RocodromoPage({ params }) {
  const resolvedParams = await params;
  return <ClientPage id={resolvedParams.id} />;
}