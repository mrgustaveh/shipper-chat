import type { PropsWithChildren, ReactNode } from "react";
import { Popover, type PopoverProps } from "@mantine/core";

type props = {
  target: ReactNode;
  options?: Partial<PopoverProps>;
} & PropsWithChildren;

export const UiPopOver = ({ target, children, options }: props) => {
  return (
    <Popover zIndex={10000} {...options}>
      <Popover.Target>{target}</Popover.Target>

      <Popover.Dropdown style={{ borderRadius: "1rem" }}>
        {children}
      </Popover.Dropdown>
    </Popover>
  );
};
