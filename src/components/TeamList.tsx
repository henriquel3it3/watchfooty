import Image from 'next/image';

interface Team {
  id: number;
  name: string;
  image_path: string;
}

interface TeamListProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
}

export default function TeamList({ teams, onSelectTeam }: TeamListProps) {
  if (!teams.length) return null;

  return (
    <ul className="bg-[#123A6F]/95 border border-[#0D2C54] rounded-xl shadow-lg 
                   max-h-80 overflow-auto mx-auto w-full max-w-lg animate-fade-in">
      {teams.map(team => (
        <li
          key={team.id}
          className="p-3 hover:bg-[#0D2C54] cursor-pointer flex items-center gap-3 text-gray-100 transition"
          onClick={() => onSelectTeam(team)} // ✅ AQUI
        >
          <Image
            src={team.image_path}
            alt={team.name}
            width={28}
            height={28}
            className="rounded-full"
            unoptimized
          />
          <span className="text-[15px]">{team.name}</span>
        </li>
      ))}
    </ul>
  );
}
