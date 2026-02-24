import { useMemo } from "react";
import { TbPencilPlus } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { UiPopOver } from "@/components/ui/UiPopOver";
import { COLORS } from "@/lib/constants";
import "./create.scss";

export const CreateMessage = () => {
  return (
    <div className="create_message">
      <p>All Messages</p>

      <UiPopOver
        target={
          <button className="create">
            <TbPencilPlus size={16} />
            New Message
          </button>
        }
        options={{
          trapFocus: true,
          width: 280,
        }}
      >
        <NewMessage />
      </UiPopOver>
    </div>
  );
};

const searchschema = z.object({
  searchvalue: z.string(),
});

type searchschematype = z.infer<typeof searchschema>;

const NewMessage = () => {
  const { register, handleSubmit, watch } = useForm<searchschematype>({
    resolver: zodResolver(searchschema),
    defaultValues: {
      searchvalue: "",
    },
  });
  const { listUsersQuery } = useApiAuth();

  // eslint-disable-next-line react-hooks/incompatible-library
  const SEARCH_VALUE = watch("searchvalue");

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
          <button key={_user?.accountId + idx} className="user_picker">
            <img
              src={_user?.displayPic ?? "/icon-bg.png"}
              alt="profile"
              loading="lazy"
            />

            <span>{_user?.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
