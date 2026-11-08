import { Meta } from "@/types";


type Props = {
  title: string
  length: number
  meta?: Meta
}


const ShowCount = ({ title, length, meta }: Props) => {
  return (
    <div className="px-4 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground/80">
          {length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground/80">
          {meta?.total ?? length}
        </span>{" "}
        {title}
      </p>

      {meta && (
        <p className="text-xs text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </p>
      )}
    </div>
  );
};

export default ShowCount;