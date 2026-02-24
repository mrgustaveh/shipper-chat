import { create } from "zustand";

type searchstore = {
  searchVaue: string;
};

type actions = {
  updateSearchValue: (value: searchstore["searchVaue"]) => void;
};

export const useSearchStore = create<searchstore & actions>((set) => ({
  searchVaue: "",
  updateSearchValue(value) {
    set(() => ({ searchVaue: value }));
  },
}));
