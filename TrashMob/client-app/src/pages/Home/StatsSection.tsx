import { useQuery } from "@tanstack/react-query";
import { GetStats } from "@/services/stats";
import { Services } from '@/config/services.config';
import StatsData from '@/components/Models/StatsData';

import Calendar from '@/components/assets/home/Calendar.svg';
import Trashbag from '@/components/assets/home/Trashbag.svg';
import Person from '@/components/assets/home/Person.svg';
import Clock from '@/components/assets/home/Clock.svg';

const useGetHomeStats = () =>
  useQuery<StatsData>({
      queryKey: GetStats().key,
      queryFn: GetStats().service,
      initialData: () => ({
          totalBags: 0,
          totalEvents: 0,
          totalHours: 0,
          totalParticipants: 0,
      }),
      initialDataUpdatedAt: 0,
      staleTime: Services.CACHE.DISABLE,
  });

export const StatsSection = () => {
  const { data: stats } = useGetHomeStats();
  const { totalBags, totalEvents, totalHours, totalParticipants } = stats;

  const statItems = [
    {
      id: 0,
      title: 'Events Hosted',
      value: totalEvents,
      icon: Calendar,
      alt: 'Calendar icon',
    },
    {
      id: 1,
      title: 'Bags Collected',
      value: totalBags,
      icon: Trashbag,
      alt: 'Trashbag icon',
    },
    {
      id: 2,
      title: 'Participants',
      value: totalParticipants,
      icon: Person,
      alt: 'Person icon',
    },
    {
      id: 3,
      title: 'Hours Spent',
      value: totalHours,
      icon: Clock,
      alt: 'Clock icon',
    },
    {
      id: 4,
      title: 'Litter Reports',
      value: totalHours,
      icon: Clock,
      alt: 'Clock icon',
    }
  ]

  return (
    <div className="container !py-20">
      <div className="flex flex-wrap gap-4 flex-row justify-center lg:justify-between">
        {statItems.map((item) => (
          <div
            key={item.id}
            className="bg-card min-w-[160px] !px-6 !py-4 shadow-sm flex flex-col items-center rounded-[11px]"
          >
            <img src={item.icon} alt={item.alt} className="primary w-9 h-9" />
            <h4 className="text-2xl font-semibold	text-primary !mt-2">{item.value}</h4>
            <span className="text-sm font-semibold">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}