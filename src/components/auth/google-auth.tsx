import Image from 'next/image';

const GoogleAuth = () => {
  return (
    <div className='border p-1 rounded-lg'>
      <div className='flex gap-2 items-center justify-center'>
        <Image
          src="https://thesvg.org/icons/google/default.svg"
          alt="Google"
          width={20}
          height={20}
        />
        <p className='font-semibold'>Google</p>
      </div>
    </div>
  );
};

export default GoogleAuth;