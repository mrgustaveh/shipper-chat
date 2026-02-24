import { useMemo } from "react";
import { TbPencilPlus } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { useChats } from "@/hooks/data/usechats";
import { useChatStore } from "../../store/chat";
import { UiPopOver } from "@/components/ui/UiPopOver";
import { COLORS } from "@/lib/constants";
import "./create.scss";

export const CreateMessage = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <div className="create_message">
      <p>All Messages</p>

      <UiPopOver
        target={
          <button
            className="create"
            onClick={() => (opened ? close() : open())}
          >
            <TbPencilPlus size={16} />
            New Message
          </button>
        }
        options={{
          trapFocus: true,
          width: 280,
          opened: opened,
          onChange: close,
        }}
      >
        <NewMessage closePopover={close} />
      </UiPopOver>
    </div>
  );
};

const searchschema = z.object({
  searchvalue: z.string(),
});

type searchschematype = z.infer<typeof searchschema>;

const NewMessage = ({ closePopover }: { closePopover: () => void }) => {
  const { register, handleSubmit, watch } = useForm<searchschematype>({
    resolver: zodResolver(searchschema),
    defaultValues: {
      searchvalue: "",
    },
  });
  const { listUsersQuery, getAccountQuery } = useApiAuth();
  const { createChatMutation, listChatsQuery } = useChats({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const SEARCH_VALUE = watch("searchvalue");

  const openOrCreateChat = (userId: string, username: string) => {
    const chatexists = listChatsQuery?.data?.find(
      (_chat) =>
        _chat?.user1?.accountId == userId || _chat?.user2?.accountId == userId,
    );

    if (chatexists) {
      useChatStore.setState({ chatMessages: [] });
      useChatStore.setState({ selectedChatId: chatexists?.chatId });
      closePopover();
    } else {
      createChatMutation
        .mutateAsync({
          user2Id: userId,
        })
        .then((res) => {
          closePopover();
          useChatStore.setState({ selectedChatId: res?.chatId });
          notifications.show({
            title: `Chat with ${username}`,
            message: "Start the conversation",
            radius: "lg",
          });
        })
        .catch(() => {
          notifications.show({
            title: "Sorry!",
            message: "An unexpected error occurred, try again",
            color: "orange",
            radius: "lg",
          });
        });
    }
  };

  const users = useMemo(() => {
    return SEARCH_VALUE == ""
      ? listUsersQuery?.data
      : listUsersQuery?.data?.filter(
          (_user) =>
            _user?.username
              ?.toLowerCase()
              ?.includes(SEARCH_VALUE?.trim()?.toLowerCase()) ||
            _user?.email
              ?.toLowerCase()
              ?.includes(SEARCH_VALUE?.trim()?.toLowerCase()),
        );
  }, [SEARCH_VALUE, listUsersQuery?.data]);

  return (
    <div id="new_messagee">
      <p className="_title">New Message</p>

      <form id="search_users" onSubmit={handleSubmit(() => {})}>
        <FiSearch
          size={18}
          className="icon_search"
          color={COLORS.text_secondary}
        />
        <input
          placeholder="Search name or email"
          {...register("searchvalue")}
        />
      </form>

      <div className="available_users">
        {users?.map((_user, idx) => (
          <button
            key={_user?.accountId + idx}
            className="user_picker"
            onClick={() =>
              openOrCreateChat(_user?.accountId, _user?.username ?? "")
            }
            disabled={getAccountQuery?.data?.accountId === _user?.accountId}
          >
            <img
              src={_user?.displayPic ?? "/icon-bg.png"}
              alt="profile"
              loading="lazy"
            />

            <span>
              {_user?.username}{" "}
              {getAccountQuery?.data?.accountId === _user?.accountId && "(You)"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
