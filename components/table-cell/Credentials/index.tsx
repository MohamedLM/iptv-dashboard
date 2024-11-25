"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Snippet,
} from "@nextui-org/react";
import { PanelCredential } from "@/libs/order";
import { KeySquare } from "iconsax-react";
import map from "lodash/map";

export default function Credentials({
  id,
  credentials,
  confirmer,
  canEdit,
}: {
  id: string;
  credentials: Array<PanelCredential>;
  confirmer?: any;
  canEdit?: boolean;
}) {
  return credentials ? (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <div className="inline-flex flex-col items-start cursor-pointer">
          <span className="text-small flex gap-1 text-inherit">
            <KeySquare size={18} />
            {`${credentials.length} credential`}
          </span>
          <span className="text-tiny text-foreground-400">
            {`processed by: ${confirmer?.name}`}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          {map(credentials, (c, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Snippet
                size="sm"
                symbol={
                  <span className="text-tiny text-foreground-400 mr-1">
                    username:
                  </span>
                }
              >
                {c.username}
              </Snippet>
              <Snippet
                size="sm"
                symbol={
                  <span className="text-tiny text-foreground-400 mr-1">
                    password:
                  </span>
                }
              >
                {c.password}
              </Snippet>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <div className="text-foreground-400 italic">not set</div>
  );
}
