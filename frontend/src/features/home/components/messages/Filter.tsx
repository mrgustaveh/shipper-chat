import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSearch } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { useSearchStore } from "../../store/search";
import { COLORS } from "@/lib/constants";
import "./filter.scss";

const schema = z.object({
  searchValue: z.string(),
  filter: z.enum(["all", "unread"]),
});

type schematype = z.infer<typeof schema>;

export const SearchFilter = () => {
  const { register, handleSubmit } = useForm<schematype>({
    resolver: zodResolver(schema),
    defaultValues: {
      searchValue: "",
      filter: "all",
    },
  });

  const onSearch = (args: schematype) => {
    useSearchStore.setState({ searchVaue: args.searchValue });
  };

  return (
    <div id="search_filter">
      <form id="search" onSubmit={handleSubmit(onSearch)}>
        <FiSearch size={18} color={COLORS.text_secondary} />
        <input
          placeholder="Search in messages"
          {...register("searchValue", {
            onChange(ev) {
              useSearchStore.setState({ searchVaue: ev.target.value });
            },
          })}
        />
      </form>

      <button id="filter">
        <CiFilter size={24} />
      </button>
    </div>
  );
};
