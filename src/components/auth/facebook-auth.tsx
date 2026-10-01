import Image from "next/image";

const FacebookAuth = () => {
  return (
    <div className='border p-1 rounded-lg'>
      <div className='flex gap-2 items-center justify-center'>
        <Image
          src="https://thesvg.org/icons/facebook/default.svg"
          alt="Facebook"
          width={21}
          height={21}
        />
        <p className='font-semibold'>Facebook</p>
      </div>
    </div>
  );
};

export default FacebookAuth;