import Image from 'next/image';
import { UserProfile } from '@/lib/types';

interface UserCardProps {
  user: UserProfile;
  rank: number;
}

const UserCard: React.FC<UserCardProps> = ({ user, rank }) => {
  const rankColor = () => {
    switch (rank) {
      case 1: return 'bg-yellow-400 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-yellow-600 text-white';
      default: return 'bg-gray-200 text-text';
    }
  };

  return (
    <div className="bg-card-bg rounded-lg shadow-md p-4 flex items-center justify-between transition-shadow duration-200 hover:shadow-lg">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${rankColor()}`}>
          {rank}
        </div>
        <Image
          src={user.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
          alt={user.username || 'User'}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <h3 className="font-heading text-lg font-bold text-text">{user.username || 'Utilisateur anonyme'}</h3>
      </div>
      <div className="font-heading text-xl font-bold text-primary">
        {(user.points || 0).toLocaleString()} pts
      </div>
    </div>
  );
};

export default UserCard;