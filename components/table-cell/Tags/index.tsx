"use client";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import Compact from "@uiw/react-color-compact";
import { Add, SearchNormal1 } from "iconsax-react";
import { Key, useEffect, useState } from "react";
import {
  actionAddNewTag,
  actionAddTag,
  actionDeleteTag,
  actionUpdateTag,
} from "./actions";
import { toast } from "sonner";
import find from "lodash/find";
import { usePathname } from "next/navigation";

type TagObject = { id: string; name: string; color: string | null };

const DropdownAddTag = ({
  onSelectedTag,
}: {
  onSelectedTag: (tag: TagObject | string) => void;
}) => {
  const [data, setData] = useState<Array<TagObject>>([]);
  const [value, setValue] = useState<string>("");

  const handleSelectTag = (key: Key) => {
    const tag = find(data, { id: String(key) }) || String(key);
    onSelectedTag(tag);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams({
        s: value,
      });
      fetch(`/api/tags?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          console.log("DATA", data);
          setData(data);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  return (
    <DropdownMenu aria-label="Add tag" onAction={handleSelectTag}>
      <DropdownSection className="mb-2" title="Add new tag">
        <DropdownItem isReadOnly className="opacity-100 p-0">
          <Input
            size="sm"
            placeholder="Search tag..."
            startContent={<SearchNormal1 size={18} />}
            isClearable
            value={value}
            onValueChange={setValue}
          />
        </DropdownItem>
      </DropdownSection>
      <DropdownSection items={data}>
        {data.length ? (
          (data) => {
            return (
              <DropdownItem key={data.id}>
                <div className="flex gap-2 items-center">
                  <span
                    className="w-2 h-2 ml-1 rounded-full"
                    style={data.color ? { background: data.color } : undefined}
                  ></span>
                  {data.name}
                </div>
              </DropdownItem>
            );
          }
        ) : (
          <DropdownItem
            isReadOnly={!value}
            className={!value ? "text-xs text-default-400 p-0" : ""}
            key={value}
          >
            {value ? `Add new: ${value}` : "Type to add new tag"}
          </DropdownItem>
        )}
      </DropdownSection>
    </DropdownMenu>
  );
};

const TagEditor = ({
  tag,
  onUpdate,
}: {
  tag: TagObject;
  onUpdate: (name: string, color: string) => void;
}) => {
  const [name, setName] = useState(tag.name);
  const [hex, setHex] = useState(tag.color || "#fff");

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        size="sm"
        label="Tag Name"
        labelPlacement="outside-left"
        value={name}
        onValueChange={setName}
      />
      <Compact
        style={{
          background:
            "hsl(var(--nextui-content1) / var(--nextui-content1-opacity, var(--tw-bg-opacity)))",
        }}
        color={hex}
        onChange={(color) => {
          setHex(color.hex);
        }}
      />
      <Button onClick={() => onUpdate(name, hex)} color="primary" size="sm">
        Update
      </Button>
    </div>
  );
};

export default function Tags({
  id,
  tagsData,
  canEdit,
}: {
  id: string;
  tagsData: Array<TagObject>;
  canEdit?: boolean;
}) {
  const pathname = usePathname();
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [tags, setTags] = useState(tagsData || []);

  const handleUpdate = (id: string, name: string, color: string) => {
    actionUpdateTag(id, { name, color }, pathname).then((result) => {
      if (result?.success) {
        toast.success(result.message || "Tag updated!");
        window.location.reload();
      } else {
        toast.error(result?.message || "Failed to update");
      }
    });
  };

  const handleDelete = (tag: TagObject) => {
    actionDeleteTag(id, tag.id).then((result) => {
      if (result?.success) {
        setTags((tags: Array<TagObject>) =>
          tags.filter((t) => t.id !== tag.id)
        );
        toast.success(result.message || "Tag deleted!");
      } else {
        toast.error(result?.message || "Failed to delete");
      }
    });
  };

  const handleTagSelect = (tag: TagObject | string) => {
    if (!tag) return;
    // if new tag
    if ("string" === typeof tag) {
      actionAddNewTag(id, tag, "customer").then(
        (res: { success: boolean; message: string; result?: TagObject }) => {
          if (res?.success && res.result) {
            setTags((tags: Array<TagObject>) => [...tags, res.result!]);
            toast.success(res.message || "Tag added!");
          } else {
            toast.error(res?.message || "Failed to add");
          }
        }
      );
    } else {
      actionAddTag(id, tag.id).then((result) => {
        if (result?.success) {
          setTags((tags: Array<TagObject>) => [...tags, tag]);
          toast.success(result.message || "Tag added!");
        } else {
          toast.error(result?.message || "Failed to add");
        }
      });
    }

    setNewTagOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 max-w-[200px]">
      {tags.map((tag: TagObject, index) => {
        return canEdit ? (
          <Popover key={index}>
            <PopoverTrigger>
              <Chip
                className="cursor-pointer text-secondary-foreground"
                style={tag.color ? { background: tag.color } : undefined}
                variant="flat"
                size="sm"
                onClose={() => handleDelete(tag)}
              >
                {tag.name}
              </Chip>
            </PopoverTrigger>
            <PopoverContent>
              <TagEditor
                tag={tag}
                onUpdate={(name, color) => handleUpdate(tag.id, name, color)}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Chip key={index} variant="flat">
            {tag.name}
          </Chip>
        );
      })}
      {canEdit ? (
        <Dropdown isOpen={newTagOpen} onOpenChange={setNewTagOpen}>
          <DropdownTrigger>
            <div>
              <Tooltip content="Add new tag">
                <Add className="cursor-pointer" />
              </Tooltip>
            </div>
          </DropdownTrigger>
          <DropdownAddTag onSelectedTag={handleTagSelect} />
        </Dropdown>
      ) : undefined}
    </div>
  );
}
