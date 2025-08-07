import Image from 'next/image';

type Props = {
  teams: any[];
  onSelect: (team: any) => void;
};

export default function TeamList({ teams, onSelect }: Props) {
  return (
    <ul className="bg-[#123A6F]/95 border border-[#0D2C54] rounded-xl shadow-lg max-h-80 overflow-auto mx-auto w-full max-w-lg animate-fade-in">
      {teams.map(team => (
        <li
          key={team.id}
          className="p-3 hover:bg-[#0D2C54] cursor-pointer flex items-center gap-3 text-gray-100 transition"
          onClick={() => onSelect(team)}
        >
          <Image src={team.image_path} alt={team.name} width={28} height={28} unoptimized />
          <span className="text-[15px]">{team.name}</span>
        </li>
      ))}
    </ul>
  );
}
