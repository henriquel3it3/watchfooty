import Image from 'next/image';

export default function Logo() {
  return (
    <div className="mb-8 w-full flex justify-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={512}
        height={140}
        priority
        className="w-full max-w-[400px] object-contain"
      />
    </div>
  );
}
