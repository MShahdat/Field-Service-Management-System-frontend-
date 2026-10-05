import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallbackText } from "@/utils";

type Props = {
  name: string;
  imageUrl: string;
  height?: number;
  width?: number;
};

const ProfileAvater = ({ name, imageUrl }: Props) => {
  return (
    <Avatar className="h-9 w-9 rounded-lg">
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback className="rounded-full text-black font-bold">
        {getFallbackText(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvater;
