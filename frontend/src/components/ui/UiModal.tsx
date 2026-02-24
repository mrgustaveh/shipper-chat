import { type PropsWithChildren } from "react";
import { Modal, type ModalProps } from "@mantine/core";

type props = {
  opened: boolean;
  close: () => void;
  modaloptions?: Partial<ModalProps>;
} & PropsWithChildren;

export const UiModal = ({ opened, close, modaloptions, children }: props) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      shadow="xs"
      padding={0}
      zIndex={1000}
      transitionProps={{ duration: 300, transition: "fade-up" }}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      yOffset="10dvh"
      styles={{
        content: { borderRadius: "1rem" },
      }}
      {...modaloptions}
    >
      {children}
    </Modal>
  );
};
