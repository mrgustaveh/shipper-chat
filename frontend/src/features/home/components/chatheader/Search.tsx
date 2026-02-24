import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import "./search.scss";

const schema = z.object({
  searchValue: z.string(),
});

type schematype = z.infer<typeof schema>;

export const SearchInput = () => {
  const { register, handleSubmit } = useForm<schematype>({
    resolver: zodResolver(schema),
    defaultValues: {
      searchValue: "",
    },
  });

  const onSearch = (args: schematype) => {
    console.log(args);
  };

  return (
    <form id="search" onSubmit={handleSubmit(onSearch)}>
      <div className="input_ctr">
        <FiSearch size={18} className="icon_search" />
        <input placeholder="Search..." {...register("searchValue")} />
      </div>

      <span className="command">
        <MdOutlineKeyboardCommandKey />K
      </span>
    </form>
  );
};
