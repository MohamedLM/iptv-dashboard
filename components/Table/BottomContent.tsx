import { Pagination } from "@nextui-org/react";
import { parseAsInteger, useQueryState } from "nuqs";

export interface Props {
  itemPerpage: number;
  numOfItems: number;
  totalItems: number;
}

export default function BottomContent({
  numOfItems,
  totalItems,
  itemPerpage,
}: Props) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
    })
  );

  const totalPage = Math.ceil(totalItems / itemPerpage);

  return (
    <div className="py-1 flex justify-center md:justify-between items-center">
      <span className="w-[30%] text-small text-default-400 hidden md:block">
        {`${numOfItems} of ${totalItems} data`}
      </span>
      {totalPage > 1 ? (
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPage}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
