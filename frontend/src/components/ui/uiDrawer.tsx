import { type PropsWithChildren } from "react";
import { Drawer, type DrawerProps } from "@mantine/core";

type props = {
  isopen: boolean;
  onclose: () => void;
  options?: Partial<DrawerProps>;
} & PropsWithChildren;

export const UiDrawer = ({ isopen, onclose, children, options }: props) => {
  return (
    <Drawer
      opened={isopen}
      onClose={onclose}
      offset={10}
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      {...options}
    >
      {children}
    </Drawer>
  );
};
